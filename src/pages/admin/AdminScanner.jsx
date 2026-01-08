import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle, Loader2, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminScanner() {
  const navigate = useNavigate();
  // Lifecycle: scanning -> detecting -> details -> generate-qr -> success
  const [status, setStatus] = useState('scanning'); 

  useEffect(() => {
    let timeout;
    if (status === 'scanning') {
      timeout = setTimeout(() => setStatus('detecting'), 3000);
    } else if (status === 'detecting') {
      timeout = setTimeout(() => setStatus('details'), 1500);
    } else if (status === 'details') {
      // Hold details for 3 seconds then generate QR
      timeout = setTimeout(() => setStatus('generate-qr'), 3000);
    } else if (status === 'generate-qr') {
      // Show QR for 3 seconds (simulating user scan) then success
      timeout = setTimeout(() => setStatus('success'), 3000);
    } else if (status === 'success') {
      timeout = setTimeout(() => setStatus('scanning'), 3000);
    }
    return () => clearTimeout(timeout);
  }, [status]);

  return (
    <div className="h-screen bg-black relative flex flex-col">
      {/* Header */}
      <div className="absolute top-6 left-4 z-50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Camera View */}
      <div className="flex-1 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop" 
          alt="Camera Feed" 
          className="w-full h-full object-cover opacity-60"
        />
        
        {/* Scanning Overlay */}
        <AnimatePresence>
          {status === 'scanning' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center p-8"
            >
              <div className="w-72 h-72 border-2 border-white/30 rounded-3xl relative overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                {/* Corner Markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-500 rounded-tl-xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-500 rounded-tr-xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-500 rounded-bl-xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-500 rounded-br-xl"></div>
                
                {/* Active Laser */}
                <motion.div 
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                  className="absolute left-0 right-0 h-0.5 bg-brand-400 shadow-[0_0_20px_rgba(56,189,248,1)]"
                />
                <motion.div 
                   animate={{ top: ['0%', '100%', '0%'] }}
                   transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                   className="absolute left-0 right-0 h-16 bg-gradient-to-b from-brand-500/20 to-transparent"
                />
              </div>
              <p className="text-white/80 mt-8 font-medium bg-black/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/10">
                Align QR code within frame
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Status Overlays */}
        <AnimatePresence>
          {status === 'detecting' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            >
              <div className="bg-white rounded-3xl p-6 text-center shadow-2xl max-w-xs mx-4">
                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-600 mx-auto mb-4">
                  <Loader2 size={32} className="animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Ticket Detected</h3>
                <p className="text-gray-500 mt-1">Fetching details...</p>
              </div>
            </motion.div>
          )}

          {/* Details Step */}
          {status === 'details' && (
             <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
            >
              <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Payment Due</h2>
                  <span className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-xs font-bold">Unpaid</span>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Vehicle</span>
                    <span className="font-bold text-gray-900">ABC-1234</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2">
                    <span className="text-gray-500">Duration</span>
                    <span className="font-bold text-gray-900">3h 15m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Amount</span>
                    <span className="text-3xl font-bold text-brand-900">$15.00</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                  <Loader2 size={16} className="animate-spin" />
                  Generating Exit Pass...
                </div>
              </div>
            </motion.div>
          )}

          {/* Generate QR Step */}
          {status === 'generate-qr' && (
             <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-white"
            >
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Scan to Exit</h2>
                <p className="text-gray-500 mb-8">Show this to the driver</p>
                
                <div className="bg-white p-4 rounded-3xl shadow-2xl border-2 border-gray-100 mx-auto w-64 h-64 flex items-center justify-center relative overflow-hidden">
                   <QrCode size={200} className="text-gray-900" />
                   {/* Scanning simulation on the generated QR */}
                   <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, ease: "linear", repeat: Infinity }}
                      className="absolute left-0 right-0 h-1 bg-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                   />
                </div>
                
                <p className="mt-8 text-sm font-medium text-brand-600 animate-pulse">
                  Simulating Driver Scan...
                </p>
              </div>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-green-600"
            >
              <div className="text-center text-white p-8">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-green-600 mx-auto mb-8 shadow-2xl"
                >
                  <CheckCircle size={64} />
                </motion.div>
                <h2 className="text-4xl font-bold mb-2">Exit Approved</h2>
                <p className="text-green-100 text-lg">Gate Opening...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
