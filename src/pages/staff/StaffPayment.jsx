import React, { useState, useEffect } from 'react';
import { CheckCircle, ChevronLeft, CreditCard, Check, Loader2, Wifi, PenTool, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ApplePayLogo, GooglePayLogo, VisaLogo, MastercardLogo, PayPalLogo, WaiverLogo, TapLogo } from '../../components/ui/PaymentLogos';

export default function StaffPayment() {
  const navigate = useNavigate();
  const { type } = useOutletContext();
  // Views: scan -> method -> [specific-process] -> processing -> success
  const [view, setView] = useState('scan'); 
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  // Card Form State
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvc: '', name: '' });

  // Auto-redirect on success
  useEffect(() => {
    if (view === 'success') {
      const timer = setTimeout(() => {
        navigate(type === 'visitor' ? '/visitor/home' : '/staff/home');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [view, navigate, type]);

  // Simulate Auto-Scan Process
  useEffect(() => {
    if (view === 'scan') {
      const timer = setTimeout(() => {
        setView('method');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // Handle Auto-Process for Tap and Wallet (Moved to top level to fix Hook error)
  useEffect(() => {
    if (view === 'process-tap' || view === 'process-wallet') {
      const duration = view === 'process-tap' ? 3000 : 2500;
      const timer = setTimeout(() => {
        finalizePayment();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [view]);

  // Handle Card Input Formatting
  const handleCardNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardDetails({ ...cardDetails, number: val });
  };

  const startPaymentProcess = () => {
    if (selectedMethod === 'Visa' || selectedMethod === 'Mastercard') {
      setView('process-card');
    } else if (selectedMethod === 'PayPal') {
      setView('process-paypal');
    } else if (selectedMethod === 'Waiver') {
      setView('process-waiver');
    } else if (selectedMethod === 'Tap to Pay') {
      setView('process-tap');
    } else {
      // Apple/Google Pay
      setView('process-wallet');
    }
  };

  const finalizePayment = () => {
    setView('processing');
    setTimeout(() => setView('success'), 2000);
  };

  const renderPaymentMethod = (name, Logo) => (
    <button
      onClick={() => setSelectedMethod(name)}
      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
        selectedMethod === name 
          ? 'border-brand-500 bg-brand-50 shadow-sm' 
          : 'border-gray-100 bg-white hover:border-brand-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-10 rounded-xl bg-white flex items-center justify-center border border-gray-100 px-2">
           <Logo className={name === 'Visa' ? "h-3 w-auto fill-brand-900" : name === 'Mastercard' ? "h-3 w-auto" : "h-6 w-auto"} />
        </div>
        <span className="font-semibold text-gray-900">{name}</span>
      </div>
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedMethod === name ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`}>
        {selectedMethod === name && <Check size={12} className="text-white" />}
      </div>
    </button>
  );

  const renderScanner = () => (
    <div className="h-full flex flex-col bg-black relative">
      <div className="absolute top-6 left-4 z-50">
        <button onClick={() => navigate(-1)} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10">
          <ChevronLeft size={24} />
        </button>
      </div>
      
      <div className="flex-1 relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1590674899505-1c5c41951f89?q=80&w=2070&auto=format&fit=crop" 
          alt="Camera" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="w-64 h-64 border-2 border-white/50 rounded-3xl relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 2, ease: "linear", repeat: Infinity }}
              className="absolute left-0 right-0 h-1 bg-brand-500 shadow-[0_0_20px_rgba(14,165,233,1)]"
            />
            <motion.div 
               animate={{ top: ['0%', '100%', '0%'] }}
               transition={{ duration: 2, ease: "linear", repeat: Infinity }}
               className="absolute left-0 right-0 h-16 bg-gradient-to-b from-brand-500/20 to-transparent"
            />
            <div className="absolute inset-0 border-4 border-white/10 rounded-3xl"></div>
          </div>
          <p className="text-white/90 mt-8 font-medium bg-black/60 px-6 py-3 rounded-full backdrop-blur-md border border-white/10">
            Scan Parking Ticket QR
          </p>
        </div>
      </div>
    </div>
  );

  const renderMethodSelection = () => (
    <div className="h-full bg-gray-50 p-6 flex flex-col overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
        <p className="text-gray-500">Select payment method</p>
      </header>

      <div className="bg-white p-6 rounded-3xl shadow-soft mb-6 flex-shrink-0">
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
          <span className="text-gray-500">Ticket ID</span>
          <span className="font-bold text-gray-900">#8829-AX</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Amount Due</span>
          <span className="text-3xl font-bold text-brand-900">$12.50</span>
        </div>
      </div>

      <div className="space-y-3 flex-1 overflow-y-auto pb-20">
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider ml-1 mb-2">Digital Wallets</h3>
        {renderPaymentMethod('Apple Pay', ApplePayLogo)}
        {renderPaymentMethod('Google Pay', GooglePayLogo)}
        
        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wider ml-1 mt-6 mb-2">Cards & Others</h3>
        {renderPaymentMethod('Visa', VisaLogo)}
        {renderPaymentMethod('Mastercard', MastercardLogo)}
        {renderPaymentMethod('PayPal', PayPalLogo)}
        {renderPaymentMethod('Tap to Pay', TapLogo)}
        {renderPaymentMethod('Waiver', WaiverLogo)}
      </div>

      <div className="fixed bottom-6 left-6 right-6">
        <Button disabled={!selectedMethod} onClick={startPaymentProcess} className="shadow-xl">
          Continue
        </Button>
      </div>
    </div>
  );

  // --- Specific Process Views ---

  const renderCardProcess = () => (
    <div className="h-full bg-gray-50 p-6 flex flex-col">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('method')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Enter Card Details</h1>
      </header>

      <div className="bg-white p-6 rounded-3xl shadow-soft space-y-6">
        <div className="flex justify-between items-center">
           <span className="font-medium text-gray-500">Paying with</span>
           {selectedMethod === 'Visa' ? <VisaLogo className="h-4 w-auto fill-brand-900" /> : <MastercardLogo className="h-6 w-auto" />}
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700 ml-1">Card Number</label>
            <div className="relative">
              <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 font-mono text-lg outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                value={cardDetails.number}
                onChange={handleCardNumberChange}
                maxLength={16}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
               <label className="text-sm font-bold text-gray-700 ml-1">Expiry</label>
               <input 
                  type="text" 
                  placeholder="MM/YY"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 text-center outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                  maxLength={5}
                />
            </div>
            <div>
               <label className="text-sm font-bold text-gray-700 ml-1">CVC</label>
               <input 
                  type="password" 
                  placeholder="123"
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 text-center outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
                  maxLength={3}
                />
            </div>
          </div>
          <div>
             <label className="text-sm font-bold text-gray-700 ml-1">Cardholder Name</label>
             <input 
                type="text" 
                placeholder="John Doe"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10"
              />
          </div>
        </div>
      </div>

      <Button onClick={finalizePayment} className="mt-auto shadow-xl">
        Pay $12.50
      </Button>
    </div>
  );

  const renderPayPalProcess = () => (
    <div className="h-full bg-white flex flex-col">
      <header className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#003087] text-white">
        <button onClick={() => setView('method')} className="p-2 hover:bg-white/10 rounded-full">
           <ChevronLeft size={24} />
        </button>
        <span className="font-bold italic text-lg">PayPal</span>
        <div className="w-8"></div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#003087] mb-4">
           <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Login to PayPal</h2>
        <Input placeholder="Email or mobile number" />
        <Input type="password" placeholder="Password" />
        <Button onClick={finalizePayment} className="bg-[#003087] hover:bg-[#001c64] text-white shadow-none">
          Log In & Pay
        </Button>
      </div>
    </div>
  );

  const renderWaiverProcess = () => (
    <div className="h-full bg-gray-50 p-6 flex flex-col">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => setView('method')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-gray-900">Waiver Request</h1>
      </header>

      <div className="bg-white p-6 rounded-3xl shadow-soft space-y-6">
         <div>
            <label className="text-sm font-bold text-gray-700 ml-1">Reason for Waiver</label>
            <select className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 outline-none mt-2">
              <option>VIP Guest</option>
              <option>Staff Validation</option>
              <option>Maintenance Issue</option>
              <option>Other</option>
            </select>
         </div>
         <div>
            <label className="text-sm font-bold text-gray-700 ml-1">Authorized By</label>
            <Input placeholder="Manager Name" className="mt-2" />
         </div>
         <div>
            <label className="text-sm font-bold text-gray-700 ml-1">Signature</label>
            <div className="h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl mt-2 flex items-center justify-center text-gray-400">
               <PenTool size={24} className="mr-2" />
               Tap to Sign
            </div>
         </div>
      </div>

      <Button onClick={finalizePayment} className="mt-auto shadow-xl">
        Submit Waiver
      </Button>
    </div>
  );

  const renderTapProcess = () => {
    // Hook removed from here
    return (
      <div className="h-full bg-black flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <button onClick={() => setView('method')} className="absolute top-6 left-6 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white z-50">
          <ChevronLeft size={24} />
        </button>
        
        <div className="relative z-10">
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center mb-8 mx-auto"
           >
              <Wifi size={64} className="text-white rotate-90" />
           </motion.div>
           <h2 className="text-2xl font-bold text-white mb-2">Hold Near Reader</h2>
           <p className="text-white/60">Tap your card or device</p>
        </div>

        {/* Background Ripple */}
        <motion.div 
           animate={{ scale: [1, 3], opacity: [0.5, 0] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="absolute w-64 h-64 bg-brand-500/30 rounded-full blur-3xl"
        />
      </div>
    );
  };

  const renderWalletProcess = () => {
    // Hook removed from here
    return (
      <div className="h-full bg-white flex flex-col items-center justify-end pb-20 relative">
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10"></div>
        
        <motion.div 
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          className="bg-white w-full rounded-t-[2rem] p-8 z-20 relative"
        >
           <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    {selectedMethod === 'Apple Pay' ? <ApplePayLogo className="h-6" /> : <GooglePayLogo className="h-6" />}
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900">Payment Request</h3>
                    <p className="text-sm text-gray-500">$12.50 • ParkPrime</p>
                 </div>
              </div>
           </div>
           
           <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 size={48} className="text-brand-500 animate-spin" />
              <p className="font-medium text-gray-600">Processing...</p>
           </div>
        </motion.div>
      </div>
    );
  };

  const renderProcessing = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 bg-white">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-brand-500"
      >
        <div className="w-20 h-20 border-4 border-brand-100 border-t-brand-500 rounded-full animate-spin mx-auto"></div>
      </motion.div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Processing...</h2>
        <p className="text-gray-500">Charging {selectedMethod}</p>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-8 bg-white">
      <motion.div 
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-lg shadow-green-100"
      >
        <CheckCircle size={64} />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful</h2>
        <p className="text-gray-500">Redirecting to home...</p>
      </motion.div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full"
        >
          {view === 'scan' && renderScanner()}
          {view === 'method' && renderMethodSelection()}
          {view === 'process-card' && renderCardProcess()}
          {view === 'process-paypal' && renderPayPalProcess()}
          {view === 'process-waiver' && renderWaiverProcess()}
          {view === 'process-tap' && renderTapProcess()}
          {view === 'process-wallet' && renderWalletProcess()}
          {view === 'processing' && renderProcessing()}
          {view === 'success' && renderSuccess()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
