import React, { useState } from 'react';
import { User, LogOut, History, ChevronRight, Mail, Phone, Shield } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function StaffProfile() {
  const navigate = useNavigate();
  const { type } = useOutletContext();
  const [showDetails, setShowDetails] = useState(false);

  // Filtered menu items as requested
  const menuItems = [
    { icon: History, label: 'Payment History', path: type === 'visitor' ? '/visitor/history' : '/staff/history' },
  ];

  return (
    <div className="p-6 pb-32 space-y-8">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      </header>

      <div className="flex items-center gap-4">
        <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60" alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg" />
        <div>
          <h2 className="text-xl font-bold text-gray-900">Alex Johnson</h2>
          <p className="text-gray-500">alex.j@company.com</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft overflow-hidden">
        {/* Personal Details Toggle */}
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
              <User size={20} />
            </div>
            <span className="font-medium text-gray-900">Personal Details</span>
          </div>
          <ChevronRight size={20} className={`text-gray-400 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </button>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-gray-50 px-5 pb-5 overflow-hidden"
            >
              <div className="space-y-4 pt-4">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                  <Shield size={18} className="text-brand-500" />
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Full Name</p>
                    <p className="font-medium text-gray-900">Alex Johnson</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                  <Mail size={18} className="text-brand-500" />
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                    <p className="font-medium text-gray-900">alex.j@company.com</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                  <Phone size={18} className="text-brand-500" />
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Mobile Number</p>
                    <p className="font-medium text-gray-900">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {menuItems.map((item, index) => (
          <button 
            key={index} 
            onClick={() => item.path && navigate(item.path)}
            className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600">
                <item.icon size={20} />
              </div>
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">{item.badge}</span>
            )}
          </button>
        ))}
      </div>

      <button 
        onClick={() => navigate('/')}
        className="w-full bg-red-50 text-red-600 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 transition-colors"
      >
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  );
}
