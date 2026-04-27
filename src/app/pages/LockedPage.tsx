import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MessageSquare, Mail, MapPin, Instagram, Linkedin, Facebook, ArrowRight, Lock, Check, Loader2, ArrowDown } from 'lucide-react';
import { api } from '../../lib/api';



export default function LockedPage() {
  const { unlock, isUnlocked } = useApp();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlock(password)) {
      window.scrollTo(0, 0);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createContactSubmission({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Submission error:', err);
      alert('Failed to send message. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-lime-400 selection:text-black">
      <div className="max-w-screen-xl mx-auto px-6 py-8 flex items-center justify-center">
        <div className="flex items-center gap-2 scale-125">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-xs">P</span>
          </div>
          <span className="font-bold text-xl tracking-tight uppercase italic">Pixel WebPages</span>
        </div>
      </div>

      <main className="max-w-screen-xl mx-auto px-6 py-12 space-y-24">
        {/* Main Contact Section (Yellow Card) */}
        <section className="relative group">
          <div className="absolute -inset-1 bg-black border-4 border-black rounded-[40px] translate-x-3 translate-y-3"></div>
          <div className="relative bg-[#FACC15] text-black p-8 md:p-16 rounded-[40px] border-4 border-black border-b-[12px] border-r-[12px]">
            <h1 className="text-5xl md:text-7xl font-black mb-12 tracking-tight leading-none uppercase italic">
              LET'S TALK BUSINESS.
            </h1>
            
            {isSubmitted ? (
              <div className="bg-white/95 border-4 border-black p-8 rounded-[30px] text-center animate-in fade-in zoom-in slide-in-from-bottom-4 shadow-[8px_8px_0px_#000]">
                <div className="w-16 h-16 bg-black text-[#FACC15] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} strokeWidth={4} />
                </div>
                <h2 className="text-3xl font-black mb-2 uppercase italic">Success!</h2>
                <p className="text-lg font-bold opacity-70 mb-6">
                  Message received. To explore the full CRM immediately, use the:
                </p>
                
                <div className="bg-black text-[#FACC15] p-4 rounded-2xl mb-6 inline-block">
                  <p className="text-xs uppercase tracking-widest font-black opacity-60 mb-1">Master Pass</p>
                  <p className="text-2xl font-mono font-black tracking-tighter">PIXEL@2026</p>
                </div>

                <div className="flex flex-col items-center gap-3 text-black">
                  <p className="font-black uppercase italic tracking-tight">Fill this below for full access</p>
                  <ArrowDown size={32} className="animate-bounce" />
                </div>

                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity underline underline-offset-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6" onSubmit={handleContactSubmit}>
                <input 
                  type="text" 
                  required
                  placeholder="Name" 
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="bg-white border-4 border-black p-5 rounded-xl placeholder:text-slate-400 font-bold focus:outline-none focus:shadow-[4px_4px_0px_#000] focus:-translate-x-1 focus:-translate-y-1 transition-all"
                />
                <input 
                  type="email" 
                  required
                  placeholder="Email" 
                  value={formData.email}
                  onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="bg-white border-4 border-black p-5 rounded-xl placeholder:text-slate-400 font-bold focus:outline-none focus:shadow-[4px_4px_0px_#000] focus:-translate-x-1 focus:-translate-y-1 transition-all"
                />
                <input 
                  type="tel" 
                  required
                  placeholder="Phone Number (10 Digits)" 
                  value={formData.phone}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, ''); // Remove non-digits
                    if (val.length <= 10) setFormData(p => ({ ...p, phone: val }));
                  }}
                  pattern="[0-9]{10}"
                  maxLength={10}
                  title="Please enter a valid 10-digit phone number"
                  className="bg-white border-4 border-black p-5 rounded-xl md:col-span-2 placeholder:text-slate-400 font-bold focus:outline-none focus:shadow-[4px_4px_0px_#000] focus:-translate-x-1 focus:-translate-y-1 transition-all"
                />
                <textarea 
                  required
                  placeholder="Brief Message/Description..." 
                  value={formData.message}
                  onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                  rows={4}
                  className="bg-white border-4 border-black p-5 rounded-xl md:col-span-2 placeholder:text-slate-400 font-bold resize-none focus:outline-none focus:shadow-[4px_4px_0px_#000] focus:-translate-x-1 focus:-translate-y-1 transition-all"
                ></textarea>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-black text-white py-6 rounded-[20px] font-black text-2xl uppercase tracking-widest hover:bg-zinc-900 transition-all md:col-span-2 active:translate-y-2 flex items-center justify-center gap-3 shadow-[8px_8px_0px_rgba(0,0,0,0.2)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={24} className="animate-spin" /> SENDING...
                    </>
                  ) : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* Access Section (Unlock Gate) */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center max-w-2xl mx-auto border-b-8 border-r-8 border-[#BEF264]">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#BEF264] rounded-2xl mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
            <Lock className="text-black" size={32} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Want to test the full CRM?</h2>
          <p className="text-slate-400 mb-8 text-lg">
            This project is currently in preview mode. If you have been provided with an access pass, enter it below to unlock all commercial modules for this session.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 justify-center" onSubmit={handleUnlock}>
            <input 
              type="password"
              placeholder="Enter Access Pass"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`flex-1 bg-black border-2 ${error ? 'border-red-500' : 'border-zinc-700'} p-4 rounded-xl focus:border-[#BEF264] focus:outline-none transition-colors text-center sm:text-left tracking-widest font-mono`}
            />
            <button 
              type="submit"
              className="bg-[#BEF264] text-black font-black px-8 py-4 rounded-xl hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              UNLOCK <ArrowRight size={20} />
            </button>
          </form>
          {error && <p className="text-red-500 mt-4 text-sm font-bold uppercase tracking-widest">Invalid Pass Code — Please Try Again</p>}
          <div className="mt-8 pt-8 border-t border-zinc-800">
             <p className="text-slate-500 text-sm italic">
               Hint: Use the pass provided in the documentation or contact support.
             </p>
          </div>
        </section>


      </main>

      {/* Footer Section */}
      <footer className="bg-black border-t border-zinc-900 mt-24 py-24 pb-12">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-black font-bold text-xs">P</span>
              </div>
              <span className="font-bold text-2xl tracking-tight">Pixel WebPages</span>
            </div>
            <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
              Empowering your business to reach new heights and reinvent your brand with innovative tech solutions.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-[#BEF264] hover:text-black transition-all">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-[#BEF264] hover:text-black transition-all">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-[#BEF264] hover:text-black transition-all">
                <Facebook size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-[#BEF264]">Contact Us</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li className="flex items-center gap-3"><Mail size={18} className="text-[#BEF264]" /> pixelwebpages@gmail.com</li>
              <li className="flex items-center gap-3"><MapPin size={18} className="text-[#BEF264]" /> Cuttack, Odisha, India</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-black uppercase tracking-widest text-[#BEF264]">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><a href="#" className="hover:text-white transition-colors">Our Services</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blogs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-screen-xl mx-auto px-6 mt-24 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500 font-medium uppercase tracking-widest">
          <p>© 2026 Pixel WebPages. All rights reserved.</p>
          <p>Designed with <span className="text-red-500">♥</span></p>
        </div>
      </footer>
    </div>
  );
}
