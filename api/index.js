import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { neon } from '@neondatabase/serverless';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Vercel only allows writes to /tmp; locally use a root 'data' folder (avoiding Vite watch)
const DATA_DIR = process.env.VERCEL ? '/tmp/pixel-crm' : path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const REQUESTS_FILE = path.join(DATA_DIR, 'access_requests.json');


// ── JSON DB helpers ───────────────────────────────────────────────────────────
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultSettings = {
  quotePdfSettings: {
    heading: 'QUOTATION', companyName: 'Pixel Web Pages', phone: '', email: '',
    address: '', website: 'www.pixelwebpages.com', logoUrl: '', gstNumber: '',
    companyState: '', country: 'India', state: '',
  },
  poPdfSettings: {
    heading: 'PURCHASE ORDER', companyName: 'Pixel Web Pages', phone: '', email: '',
    address: '', website: 'www.pixelwebpages.com', logoUrl: '', gstNumber: '',
    companyState: '', country: 'India', state: '',
  },
  piPdfSettings: {
    heading: 'PROFORMA INVOICE', companyName: 'Pixel Web Pages', phone: '', email: '',
    address: '', website: 'www.pixelwebpages.com', logoUrl: '', gstNumber: '',
    companyState: '', country: 'India', state: '',
    bankName: '', accountNo: '', ifsc: '', branch: '', upiId: '',
  },
  taxInvoicePdfSettings: {
    heading: 'TAX INVOICE', companyName: 'Pixel Web Pages', phone: '', email: '',
    address: '', website: 'www.pixelwebpages.com', logoUrl: '', gstNumber: '',
    companyState: '', country: 'India', state: '',
  },
};

const DUMMY_SERVICES = [
  { id: '1', name: 'Web Development', hsn_code: '998313', subCategories: [{ id: 's1', name: 'Frontend' }, { id: 's2', name: 'Backend' }] },
  { id: '2', name: 'Graphic Design', hsn_code: '998391', subCategories: [{ id: 's3', name: 'Logo Design' }, { id: 's4', name: 'Branding' }] },
  { id: '3', name: 'SEO Services', hsn_code: '998315', subCategories: [{ id: 's5', name: 'On-page SEO' }, { id: 's6', name: 'Backlink Building' }] },
  { id: '4', name: 'Content Marketing', hsn_code: '998316', subCategories: [{ id: 's7', name: 'Blog Writing' }, { id: 's8', name: 'Copywriting' }] },
  { id: '5', name: 'Digital Strategy', hsn_code: '998317', subCategories: [{ id: 's9', name: 'Ad Management' }, { id: 's10', name: 'Market Research' }] },
];

function loadDB() {
  ensureDataDir();
  let db;
  if (!fs.existsSync(DB_FILE)) {
    db = {
      services: [...DUMMY_SERVICES], enquiries: [], quotations: [],
      orders: [], marketResearch: [], settings: defaultSettings,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } else {
    db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    // Ensure dummy services exist on every load (come back on refresh)
    DUMMY_SERVICES.forEach(ds => {
      if (!db.services.find(s => s.id === ds.id)) {
        db.services.push(ds);
      }
    });
  }
  return db;
}

function saveDB(db) {
  ensureDataDir();
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function uid() { return crypto.randomUUID(); }

// ── Express setup ─────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// ── SERVICES ──────────────────────────────────────────────────────────────────
app.get('/api/services', (req, res) => {
  res.json(loadDB().services || []);
});

app.post('/api/services', (req, res) => {
  const { name, hsn_code } = req.body;
  const db = loadDB();
  const service = { id: uid(), name, hsn_code: hsn_code || '', created_at: new Date().toISOString(), subCategories: [] };
  db.services.push(service);
  saveDB(db);
  res.json(service);
});

app.put('/api/services/:id', (req, res) => {
  const db = loadDB();
  const svc = db.services.find(s => s.id === req.params.id);
  if (svc) { svc.name = req.body.name; svc.hsn_code = req.body.hsn_code || ''; saveDB(db); }
  res.json({ success: true });
});

app.post('/api/sub-categories', (req, res) => {
  const { service_id, name } = req.body;
  const db = loadDB();
  const svc = db.services.find(s => s.id === service_id);
  if (!svc) return res.status(404).json({ error: 'Service not found' });
  const sub = { id: uid(), service_id, name, created_at: new Date().toISOString() };
  (svc.subCategories = svc.subCategories || []).push(sub);
  saveDB(db);
  res.json(sub);
});

app.put('/api/sub-categories/:id', (req, res) => {
  const db = loadDB();
  for (const svc of db.services) {
    const sub = (svc.subCategories || []).find(sc => sc.id === req.params.id);
    if (sub) { sub.name = req.body.name; saveDB(db); break; }
  }
  res.json({ success: true });
});

app.delete('/api/sub-categories/:id', (req, res) => {
  const db = loadDB();
  for (const svc of db.services) {
    const idx = (svc.subCategories || []).findIndex(sc => sc.id === req.params.id);
    if (idx !== -1) { svc.subCategories.splice(idx, 1); saveDB(db); break; }
  }
  res.json({ success: true });
});

// ── ENQUIRIES ─────────────────────────────────────────────────────────────────
app.get('/api/enquiries', (req, res) => {
  res.json(loadDB().enquiries || []);
});

app.post('/api/enquiries', (req, res) => {
  const { services: enquiryServices, ...data } = req.body;
  const db = loadDB();

  // Enforce max 15 — evict the oldest by created_at (FIFO)
  if (db.enquiries.length >= 15) {
    db.enquiries.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    db.enquiries.shift();
  }

  const id = uid();
  const enquiry = {
    id,
    date: data.date || new Date().toISOString().split('T')[0],
    contact_name: data.contact_name,
    company_name: data.company_name,
    mobile_number: data.mobile_number || '',
    website: data.website || '',
    email: data.email || '',
    company_address: data.company_address || '',
    gst_number: data.gst_number || '',
    gst_slab: data.gst_slab || 0,
    tax_type: data.tax_type || 'Exclusive',
    country: data.country || 'India',
    state: data.state || '',
    description: data.description || '',
    status: 'active',
    converted_to_quote: false,
    created_at: new Date().toISOString(),
    services: (enquiryServices || []).map(s => ({
      id: uid(), enquiry_id: id,
      service_id: s.service_id, sub_service_id: s.sub_service_id || null,
    })),
  };
  db.enquiries.push(enquiry);
  saveDB(db);
  res.json(enquiry);
});

// ── CONTACT SUBMISSIONS (New) ────────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    await sql`
      INSERT INTO contact_submissions (name, email, phone, message)
      VALUES (${name}, ${email}, ${phone}, ${message})
    `;
    res.json({ success: true });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Failed to save contact submission' });
  }
});

app.put('/api/enquiries/:id', (req, res) => {
  const { services: enquiryServices, ...data } = req.body;
  const db = loadDB();
  const enq = db.enquiries.find(e => e.id === req.params.id);
  if (!enq) return res.status(404).json({ error: 'Not found' });

  const allowed = ['date', 'contact_name', 'company_name', 'mobile_number', 'website', 'email',
    'company_address', 'gst_number', 'gst_slab', 'tax_type', 'country', 'state', 'description',
    'status', 'converted_to_quote'];
  for (const k of allowed) { if (data[k] !== undefined) enq[k] = data[k]; }

  if (enquiryServices !== undefined) {
    enq.services = enquiryServices.map(s => ({
      id: uid(), enquiry_id: enq.id,
      service_id: s.service_id, sub_service_id: s.sub_service_id || null,
    }));
  }
  saveDB(db);
  res.json({ success: true });
});

app.delete('/api/enquiries/:id', (req, res) => {
  const db = loadDB();
  db.enquiries = db.enquiries.filter(e => e.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// ── QUOTATIONS ────────────────────────────────────────────────────────────────
app.get('/api/quotations', (req, res) => {
  res.json(loadDB().quotations || []);
});

app.post('/api/quotations', (req, res) => {
  const { items, ...data } = req.body;
  const db = loadDB();
  const id = uid();
  const quotation = {
    id, ...data,
    items: (items || []).map(it => ({ id: uid(), quotation_id: id, ...it })),
    status: 'active', converted_to_order: false,
    date: data.date || new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  };
  if (data.enquiry_id) {
    const enq = db.enquiries.find(e => e.id === data.enquiry_id);
    if (enq) enq.converted_to_quote = true;
  }
  db.quotations.push(quotation);
  saveDB(db);
  res.json(quotation);
});

app.put('/api/quotations/:id', (req, res) => {
  const { items, ...data } = req.body;
  const db = loadDB();
  const q = db.quotations.find(q => q.id === req.params.id);
  if (!q) return res.status(404).json({ error: 'Not found' });
  Object.assign(q, data);
  if (items !== undefined) q.items = items.map(it => ({ id: uid(), quotation_id: q.id, ...it }));
  saveDB(db);
  res.json({ success: true });
});

// ── ORDERS ────────────────────────────────────────────────────────────────────
app.get('/api/orders', (req, res) => {
  res.json(loadDB().orders || []);
});

app.post('/api/orders', (req, res) => {
  const { services: orderServices, payments, refundPayments, ...data } = req.body;
  const db = loadDB();
  const id = uid();
  const order = {
    id, ...data,
    services: (orderServices || []).map(s => ({ id: uid(), order_id: id, ...s })),
    payments: (payments || []).map(p => ({ id: uid(), order_id: id, ...p })),
    refund_payments: (refundPayments || []).map(r => ({ id: uid(), order_id: id, ...r })),
    status: 'active', created_at: new Date().toISOString(),
    date: data.date || new Date().toISOString().split('T')[0],
  };
  if (data.quotation_id) {
    const q = db.quotations.find(q => q.id === data.quotation_id);
    if (q) q.converted_to_order = true;
  }
  db.orders.push(order);
  saveDB(db);
  res.json(order);
});

app.put('/api/orders/:id', (req, res) => {
  const { services, payments, refundPayments, ...data } = req.body;
  const db = loadDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Not found' });
  Object.assign(order, data);
  if (services !== undefined) order.services = services.map(s => ({ id: uid(), order_id: order.id, ...s }));
  if (payments !== undefined) order.payments = payments.map(p => ({ id: uid(), order_id: order.id, ...p }));
  if (refundPayments !== undefined) order.refund_payments = refundPayments.map(r => ({ id: uid(), order_id: order.id, ...r }));
  saveDB(db);
  res.json({ success: true });
});

app.delete('/api/quotations/:id', (req, res) => {
  const db = loadDB();
  db.quotations = (db.quotations || []).filter(q => q.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

app.delete('/api/orders/:id', (req, res) => {
  const db = loadDB();
  db.orders = (db.orders || []).filter(o => o.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// ── MARKET RESEARCH ───────────────────────────────────────────────────────────
app.get('/api/market-research', (req, res) => {
  res.json(loadDB().marketResearch || []);
});

app.post('/api/market-research', (req, res) => {
  const db = loadDB();
  const company = { id: uid(), ...req.body, created_at: new Date().toISOString() };
  db.marketResearch.push(company);
  saveDB(db);
  res.json(company);
});

app.put('/api/market-research/:id', (req, res) => {
  const db = loadDB();
  const idx = db.marketResearch.findIndex(c => c.id === req.params.id);
  if (idx !== -1) { Object.assign(db.marketResearch[idx], req.body); saveDB(db); }
  res.json({ success: true });
});

app.delete('/api/market-research/:id', (req, res) => {
  const db = loadDB();
  db.marketResearch = db.marketResearch.filter(c => c.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// ── SETTINGS ──────────────────────────────────────────────────────────────────
app.get('/api/settings', (req, res) => {
  const db = loadDB();
  res.json(db.settings || defaultSettings);
});

app.put('/api/settings', (req, res) => {
  const db = loadDB();
  db.settings = { ...(db.settings || {}), ...req.body };
  saveDB(db);
  res.json({ success: true });
});




// ── Start (local dev) / Export (Vercel serverless) ───────────────────────────
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Pixel CRM server → http://localhost:${PORT}`));
}

export default app;
