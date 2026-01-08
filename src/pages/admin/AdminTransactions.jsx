import React from 'react';
import { ArrowLeft, Banknote, CreditCard, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ApplePayLogo, GooglePayLogo, VisaLogo, MastercardLogo } from '../../components/ui/PaymentLogos';

// Mock Data (Subset of reports)
const transactions = [
  { id: 1, method: 'Apple Pay', amount: '12.50', time: '2:30 PM', vehicle: 'ABC-1234', dept: 'Visitor', status: 'success' },
  { id: 2, method: 'Cash', amount: '8.00', time: '2:15 PM', vehicle: 'XYZ-9876', dept: 'Staff', status: 'success' },
  { id: 3, method: 'Visa', amount: '24.00', time: '1:55 PM', vehicle: 'LMN-4567', dept: 'Visitor', status: 'success' },
  { id: 4, method: 'Waiver', amount: '0.00', time: '1:30 PM', vehicle: 'VIP-001', dept: 'VIP', status: 'success' },
  { id: 5, method: 'Google Pay', amount: '15.50', time: '1:12 PM', vehicle: 'PQR-1122', dept: 'Visitor', status: 'failed' },
  { id: 6, method: 'Mastercard', amount: '10.00', time: '12:45 PM', vehicle: 'STU-9988', dept: 'Visitor', status: 'success' },
];

export default function AdminTransactions() {
  const navigate = useNavigate();

  const getIcon = (method) => {
    if (method === 'Apple Pay') return <ApplePayLogo className="text-xs" />;
    if (method === 'Google Pay') return <GooglePayLogo className="text-xs" />;
    if (method === 'Visa') return <VisaLogo className="h-3 w-auto fill-brand-900" />;
    if (method === 'Mastercard') return <MastercardLogo className="h-3 w-auto" />;
    if (method === 'Cash') return <Banknote size={20} className="text-green-600" />;
    return <CreditCard size={20} className="text-gray-600" />;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl z-40 border-b border-gray-100/50 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
             <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Recent Transactions</h1>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {transactions.map((tx, index) => (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.05 }}
            key={tx.id} 
            className={`bg-white p-5 rounded-3xl shadow-soft flex items-center justify-between border border-gray-50/50 hover:shadow-lg transition-shadow
              ${tx.status === 'failed' ? 'opacity-60 grayscale' : ''}`}
          >
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner flex-shrink-0">
                {getIcon(tx.method)}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{tx.vehicle}</h3>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
                  {tx.dept} • {tx.method}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`font-bold text-lg ${tx.status === 'failed' ? 'text-red-500 line-through' : 'text-gray-900'}`}>
                +${tx.amount}
              </p>
              <p className="text-xs text-gray-400 font-medium">{tx.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
