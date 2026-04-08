"use client";

import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

interface WhatsAppModalProps {
  isFloating?: boolean;
  children?: React.ReactNode;
}

export function WhatsAppModal({ isFloating = false, children }: WhatsAppModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    query: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct the WhatsApp message
    const message = `Hello AimHop, I have an inquiry:\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Query:* ${formData.query}`;
    const encodedMessage = encodeURIComponent(message);
    
    // Assuming AimHop's WhatsApp number is 9151385320 based on previous configurations
    const whatsappNumber = "919151385320"; 
    
    // Redirect to WhatsApp
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    
    // Close modal and reset form
    setIsOpen(false);
    setFormData({ name: "", phone: "", query: "" });
  };

  return (
    <>
      {/* Trigger children */}
      {children && (
        <div onClick={() => setIsOpen(true)} className="w-full cursor-pointer">
          {children}
        </div>
      )}

      {/* Floating Button */}
      {isFloating && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300 z-50 group"
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle size={28} />
          <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
            Chat with us
          </span>
        </button>
      )}

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="bg-green-500 p-6 text-white text-center relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 p-1 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <MessageCircle size={32} className="text-green-500" />
              </div>
              <h3 className="font-black text-xl uppercase tracking-tight">WhatsApp Inquiry</h3>
              <p className="text-green-50 text-xs font-medium mt-1">Please fill out this quick form to connect.</p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Full Name</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-slate-900 dark:text-white"
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  placeholder="e.g. +91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-1">Your Query</label>
                <textarea 
                  required 
                  rows={3} 
                  placeholder="How can we help you today?"
                  value={formData.query}
                  onChange={(e) => setFormData({...formData, query: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold outline-none resize-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500/50 transition-all text-slate-900 dark:text-white"
                />
              </div>

              <button 
                type="submit"
                className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white rounded-xl py-4 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-green-500/20 active:scale-95 transition-all"
              >
                <Send size={16} /> Continue to WhatsApp
              </button>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
