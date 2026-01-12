import React, { useState, useRef } from 'react';
import { User, LogOut, History, ChevronRight, Mail, Phone, Shield, Camera } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function StaffProfile() {
  const navigate = useNavigate();
  const { type } = useOutletContext();
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRef = useRef(null);

  // Portal-specific profile data
  const isStaff = type === 'staff';
  const profileData = isStaff
    ? {
      name: 'Sriram Xander',
      email: 'sarah.mitchell@company.com',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF2yaox2cALIq_yyd-9qEyovEsficJr7X9QQ&s'
    }
    : {
      name: 'Sriram Xander',
      email: 'sriramxander@company.com',
      image: 'https://static.vecteezy.com/system/resources/thumbnails/058/270/883/small/confident-young-man-posing-with-crossed-arms-in-casual-denim-shirt-png.png'
    };

  // New State for Editable Details
  const [name, setName] = useState(profileData.name);
  const [email, setEmail] = useState(profileData.email);
  const [profileImage, setProfileImage] = useState(profileData.image);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  // Handle profile photo upload
  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
        <div className="relative">
          <img src={profileImage} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg bg-white" />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-8 h-8 bg-brand-900 rounded-full flex items-center justify-center shadow-lg hover:bg-brand-950 transition-colors"
          >
            <Camera size={16} className="text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          <p className="text-gray-500">{email}</p>
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
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1">
                    <Shield size={18} className="text-brand-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-bold uppercase">Full Name</p>
                      {isEditingName ? (
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={() => setIsEditingName(false)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 mt-1 font-medium text-gray-900 outline-none focus:border-brand-500"
                          autoFocus
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{name}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingName(!isEditingName)}
                    className="p-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    {isEditingName ? 'Save' : 'Edit'}
                  </button>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3 flex-1">
                    <Mail size={18} className="text-brand-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs text-gray-400 font-bold uppercase">Email Address</p>
                      {isEditingEmail ? (
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onBlur={() => setIsEditingEmail(false)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 mt-1 font-medium text-gray-900 outline-none focus:border-brand-500"
                          autoFocus
                        />
                      ) : (
                        <p className="font-medium text-gray-900">{email}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingEmail(!isEditingEmail)}
                    className="p-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:bg-brand-50 rounded-lg transition-colors"
                  >
                    {isEditingEmail ? 'Save' : 'Edit'}
                  </button>
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
