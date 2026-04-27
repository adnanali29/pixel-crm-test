# Pixel CRM - Preview Edition 🚀

This is a **Test Project** designed to demonstrate the core Enquiry management workflow of the Pixel CRM. 

> [!IMPORTANT]
> **Limited Access Notice**: This is a restricted "Dummy CRM" version. 
> Only the **Enquiry** module is active for testing. Advanced features like Quotations, Orders, Revenue Tracking, and Sales Analytics are locked and will redirect you to our official contact page for full version access.

---

## 🛠️ Features in this Version

- **Enquiry Pipeline**: Full CRUD access to manage incoming leads and enquiries.
- **Local Data Intelligence**: Uses a high-performance local JSON database for instant response times (Self-contained, no external DB needed).
- **Enquiry Limits**: Restricted to tracking the **15 most recent enquiries** to maintain a lean preview environment.
- **Auto-Redirection**: Direct links to our sales team for Quotation, Order, and Analytics feature requests.
- **Premium UI**: Modern, glassmorphism-inspired dashboard built for speed and aesthetics.

---

## 🏁 Getting Started

To run this project locally, follow these simple steps:

### 1. Installation
Install the necessary dependencies using npm:
```bash
npm install
```

### 2. Running the Application
Launch both the **Frontend (Vite)** and the **Backend (Express)** simultaneously:
```bash
npm run dev
```

### 3. Testing Guided Flow (Full Access)
This preview version is restricted by default. To unlock the full commercial suite (Quotations, Orders, etc.) for testing:
1. Navigate to any locked item (like **Quotation**).
2. Enter the **Master Pass**: `PIXEL@2026`.
3. The app will unlock all features for the current session.
4. **Note**: When unlocked, the app enters "Safe Testing Mode" — any data created will be kept in memory for that session and will be lost on refresh (this ensures no data is pushed to the test server).

The application will be available at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001`

---

## 📂 Project Structure

- **`/api`**: The lightweight Express.js server and JSON-based data layer.
- **`/src`**: The React-based frontend application.
- **`/api/data`**: Local storage directory for the enquiry database (`db.json`).

---

## 🔐 Security & Access
This preview version has **all authentication removed** for ease of testing. No login is required to access the Enquiry dashboard.

To request the **Full Pixel CRM Suite** (PostgreSQL-backed, multi-user auth, PDF generation, etc.), please click any locked icon in the app or visit:
[https://www.pixelwebpages.com/contact](https://www.pixelwebpages.com/contact)

---
*Product by **Pixel Web Pages***
