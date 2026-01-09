import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Bell, CheckCircle2, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StaffHome() {
  const { type } = useOutletContext();
  const navigate = useNavigate();
  const isStaff = type === 'staff';
  const basePath = type === 'visitor' ? '/visitor' : '/staff';

  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkUnread = () => {
      const saved = localStorage.getItem('pro_parking_notifications');
      if (saved) {
        const notifs = JSON.parse(saved);
        setHasUnread(notifs.some(n => n.unread));
      }
    };

    checkUnread();
    window.addEventListener('storage', checkUnread);
    return () => window.removeEventListener('storage', checkUnread);
  }, []);

  return (
    <div className="p-6 pb-32 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{isStaff ? 'Staff Pass' : 'Visitor Pass'}</h1>
          <p className="text-gray-500">Digital Identity</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`${basePath}/notifications`)}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-soft relative"
          >
            <Bell size={20} />
            {hasUnread && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
          <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold">
            AJ
          </div>
        </div>
      </header>

      {/* Digital ID Card */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-[2rem] p-8 text-white shadow-xl shadow-brand-900/20 relative overflow-hidden"
      >
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-500/20 rounded-full -ml-10 -mb-10 blur-xl"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-full p-1 border-2 border-white/20">
            <img src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D" alt="User" className="w-full h-full rounded-full object-cover" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">Alex Johnson</h2>
            {/* Only show ID for Staff */}
            {isStaff ? (
              <p className="text-brand-200">Staff Member • ID #8829</p>
            ) : (
              <p className="text-brand-200">Visitor</p>
            )}
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <QrCode size={120} className="text-gray-900" />
          </div>

          <div className="flex items-center gap-2 bg-green-500/20 text-green-100 px-4 py-1.5 rounded-full text-sm font-medium backdrop-blur-md border border-green-500/30">
            <CheckCircle2 size={16} />
            <span>Active Pass</span>
          </div>
        </div>
      </motion.div>

      {/* Quick Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-soft">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Valid Until</p>
          <p className="text-lg font-bold text-gray-900">Dec 31, 2025</p>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-soft">
          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Location</p>
          <p className="text-lg font-bold text-gray-900">Level B2</p>
        </div>
      </div>
    </div>
  );
}
