import React, { useState } from 'react';
import { MapPin, Calendar, ArrowRight, Check, Clock, CreditCard, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { ApplePayLogo, GooglePayLogo, VisaLogo, MastercardLogo, PayPalLogo, WaiverLogo, TapLogo } from '../../components/ui/PaymentLogos';

const LOCATIONS = ['A', 'B', 'C'];
const SPOTS = Array.from({ length: 12 }, (_, i) => i + 1);

const upcomingBookings = [
  { id: 1, location: 'Location A', spot: 'A-05', date: 'Dec 25, 2025', time: '10:00 AM', duration: '2h' },
];

export default function StaffBooking() {
  const [view, setView] = useState('list'); // list, wizard
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    location: null,
    date: '',
    time: '',
    duration: '1',
    spot: null,
    paymentMethod: null
  });

  const handleStartBooking = () => {
    setView('wizard');
    setStep(1);
    setBookingData({
      location: null,
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      duration: '1',
      spot: null,
      paymentMethod: null
    });
  };

  const handleConfirmPayment = () => {
    // Simulate processing
    setStep(5); // Success step
  };

  const renderPaymentMethod = (name, Logo) => (
    <button
      onClick={() => setBookingData({ ...bookingData, paymentMethod: name })}
      className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${
        bookingData.paymentMethod === name 
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
      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${bookingData.paymentMethod === name ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`}>
        {bookingData.paymentMethod === name && <Check size={12} className="text-white" />}
      </div>
    </button>
  );

  if (view === 'list') {
    return (
      <div className="p-6 pb-32 space-y-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
          <p className="text-gray-500">Manage your reservations</p>
        </header>

        {/* Upcoming Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">Upcoming</h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-3">
              {upcomingBookings.map(booking => (
                <div key={booking.id} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-900">{booking.location} • Spot {booking.spot}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Calendar size={14} /> {booking.date}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock size={14} /> {booking.time} ({booking.duration})
                    </div>
                  </div>
                  <div className="bg-brand-50 text-brand-700 px-3 py-1 rounded-lg text-xs font-bold">
                    Confirmed
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center py-8 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
               No upcoming bookings
             </div>
          )}
        </div>

        <Button onClick={handleStartBooking} className="mt-4">
          New Booking <ArrowRight size={20} />
        </Button>
      </div>
    );
  }

  // Wizard View
  return (
    <div className="p-6 pb-32 space-y-6">
      <header className="flex items-center gap-2">
        <button onClick={() => setView('list')} className="p-2 -ml-2 text-gray-400 hover:text-gray-600">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">New Booking</h1>
          <p className="text-gray-500">Step {step} of 4</p>
        </div>
      </header>

      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${step >= s ? 'bg-brand-500' : 'bg-gray-200'}`}></div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <MapPin size={20} className="text-brand-500" /> Select Location
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setBookingData({ ...bookingData, location: loc })}
                  className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all
                    ${bookingData.location === loc 
                      ? 'border-brand-500 bg-brand-50 text-brand-900' 
                      : 'border-gray-100 bg-white text-gray-500 hover:border-brand-200'}`}
                >
                  <div className="text-left">
                    <span className="block text-xl font-bold">Location {loc}</span>
                    <span className="text-sm opacity-70">Level {loc === 'A' ? '1' : loc === 'B' ? '2' : '3'}</span>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${bookingData.location === loc ? 'border-brand-500 bg-brand-500' : 'border-gray-300'}`}>
                    {bookingData.location === loc && <Check size={14} className="text-white" />}
                  </div>
                </button>
              ))}
            </div>
            <Button disabled={!bookingData.location} onClick={() => setStep(2)} className="mt-8">Next Step</Button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Clock size={20} className="text-brand-500" /> Date & Time
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-brand-500"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <input 
                    type="time" 
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-brand-500"
                    value={bookingData.time}
                    onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Hrs)</label>
                  <select 
                    className="w-full p-4 bg-white border border-gray-200 rounded-2xl outline-none focus:border-brand-500 appearance-none"
                    value={bookingData.duration}
                    onChange={(e) => setBookingData({...bookingData, duration: e.target.value})}
                  >
                    {[1, 2, 3, 4, 5, 8, 12, 24].map(h => (
                      <option key={h} value={h}>{h} Hour{h > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="secondary" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next Step</Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <MapPin size={20} className="text-brand-500" /> Select Spot
            </h3>
            
            <div className="grid grid-cols-4 gap-3">
              {SPOTS.map((spot) => {
                const isOccupied = Math.random() > 0.7;
                return (
                  <button
                    key={spot}
                    disabled={isOccupied}
                    onClick={() => setBookingData({...bookingData, spot})}
                    className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all
                      ${isOccupied 
                        ? 'bg-gray-100 text-gray-300 cursor-not-allowed' 
                        : bookingData.spot === spot
                          ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/30'
                          : 'bg-white border border-gray-100 text-gray-700 hover:border-brand-300'
                      }`}
                  >
                    {spot}
                  </button>
                );
              })}
            </div>
            
            <div className="flex gap-4 items-center text-xs text-gray-500 justify-center mt-2">
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-white border border-gray-300 rounded-full"></div> Free</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-brand-900 rounded-full"></div> Selected</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 bg-gray-200 rounded-full"></div> Busy</span>
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="secondary" onClick={() => setStep(2)}>Back</Button>
              <Button disabled={!bookingData.spot} onClick={() => setStep(4)}>Proceed to Pay</Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <CreditCard size={20} className="text-brand-500" /> Payment
            </h3>
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Booking Fee</span>
                <span className="font-bold">$5.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Duration ({bookingData.duration}h)</span>
                <span className="font-bold">${(parseInt(bookingData.duration) * 2).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 my-2 pt-2 flex justify-between text-lg font-bold text-brand-900">
                <span>Total</span>
                <span>${(5 + parseInt(bookingData.duration) * 2).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 h-64 overflow-y-auto pr-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Digital Wallets</h4>
              {renderPaymentMethod('Apple Pay', ApplePayLogo)}
              {renderPaymentMethod('Google Pay', GooglePayLogo)}
              
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-4 mb-2">Cards & Others</h4>
              {renderPaymentMethod('Visa', VisaLogo)}
              {renderPaymentMethod('Mastercard', MastercardLogo)}
              {renderPaymentMethod('PayPal', PayPalLogo)}
              {renderPaymentMethod('Tap to Pay', TapLogo)}
              {renderPaymentMethod('Waiver', WaiverLogo)}
            </div>

            <div className="flex gap-4 mt-8">
              <Button variant="secondary" onClick={() => setStep(3)}>Back</Button>
              <Button disabled={!bookingData.paymentMethod} onClick={handleConfirmPayment}>Pay & Confirm</Button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div key="step5" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center text-center space-y-6 py-10">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-xl shadow-green-100">
              <Check size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed!</h2>
            <p className="text-gray-500">
              Location {bookingData.location}, Spot {bookingData.spot}<br/>
              {bookingData.date} at {bookingData.time}
            </p>
            <Button onClick={() => setView('list')} variant="secondary" className="mt-8">Done</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
