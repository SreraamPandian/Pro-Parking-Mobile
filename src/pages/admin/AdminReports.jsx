import React, { useState, useRef, useEffect } from 'react';
import { DollarSign, Banknote, CreditCard, ChevronDown, ArrowLeft } from 'lucide-react';
import { ApplePayLogo, GooglePayLogo, VisaLogo, MastercardLogo } from '../../components/ui/PaymentLogos';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock Data
const transactions = [
  { id: 1, method: 'Apple Pay', amount: '12.50', time: '2:30 PM', vehicle: 'ABC-1234', dept: 'Visitor', status: 'success' },
  { id: 2, method: 'Cash', amount: '8.00', time: '2:15 PM', vehicle: 'XYZ-9876', dept: 'Staff', status: 'success' },
  { id: 3, method: 'Visa', amount: '24.00', time: '1:55 PM', vehicle: 'LMN-4567', dept: 'Visitor', status: 'success' },
  { id: 4, method: 'Waiver', amount: '0.00', time: '1:30 PM', vehicle: 'VIP-001', dept: 'VIP', status: 'success' },
  { id: 5, method: 'Google Pay', amount: '15.50', time: '1:12 PM', vehicle: 'PQR-1122', dept: 'Visitor', status: 'failed' },
  { id: 6, method: 'Mastercard', amount: '10.00', time: '12:45 PM', vehicle: 'STU-9988', dept: 'Visitor', status: 'success' },
  { id: 7, method: 'Cash', amount: '5.00', time: '12:30 PM', vehicle: 'JKL-5544', dept: 'Staff', status: 'success' },
  { id: 8, method: 'Apple Pay', amount: '12.50', time: '11:30 AM', vehicle: 'ABC-1234', dept: 'Visitor', status: 'success' },
  { id: 9, method: 'Cash', amount: '8.00', time: '11:15 AM', vehicle: 'XYZ-9876', dept: 'Staff', status: 'success' },
];

const FilterDropdown = ({ label, active, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0
          ${active 
            ? 'bg-brand-900 text-white shadow-lg shadow-brand-900/20' 
            : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}
        `}
      >
        {label}
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''} ${active ? 'text-white' : 'text-gray-400'}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 min-w-[150px] z-50 overflow-hidden"
          >
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
              >
                {opt}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AdminReports() {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('Today');
  const [methodFilter, setMethodFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Filter Logic
  const filteredTransactions = transactions.filter(tx => {
    if (methodFilter !== 'All' && !tx.method.includes(methodFilter)) return false;
    if (deptFilter !== 'All' && tx.dept !== deptFilter) return false;
    return true;
  });

  const totalRevenue = filteredTransactions
    .filter(tx => tx.status === 'success')
    .reduce((sum, tx) => sum + parseFloat(tx.amount), 0)
    .toFixed(2);

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
      {/* Sticky Header with Filters */}
      <div className="sticky top-0 bg-white/90 backdrop-blur-xl z-40 border-b border-gray-100/50 px-6 py-4 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => navigate('/admin/dashboard')} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
             <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
        </div>
        
        {/* Changed from overflow-x-auto to flex-wrap to prevent clipping of dropdowns */}
        <div className="flex flex-wrap gap-3 pb-2">
          <FilterDropdown 
            label={dateFilter} 
            active={true} 
            options={['Today', 'Yesterday', 'This Week', 'Custom Range']}
            onSelect={setDateFilter}
          />
          <FilterDropdown 
            label={methodFilter === 'All' ? 'Method: All' : methodFilter} 
            active={methodFilter !== 'All'} 
            options={['All', 'Cash', 'Card', 'Apple Pay', 'Google Pay', 'Waiver']}
            onSelect={setMethodFilter}
          />
          <FilterDropdown 
            label={deptFilter === 'All' ? 'Dept: All' : deptFilter} 
            active={deptFilter !== 'All'} 
            options={['All', 'Visitor', 'Staff', 'VIP']}
            onSelect={setDeptFilter}
          />
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Revenue Summary Card */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-brand-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-brand-900/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 opacity-80">
              <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md">
                <DollarSign size={20} />
              </div>
              <span className="font-medium tracking-wide">Total Revenue</span>
            </div>
            <h2 className="text-5xl font-bold tracking-tight mb-1">${totalRevenue}</h2>
            <p className="text-brand-200 font-medium">
              {filteredTransactions.length} transactions found
            </p>
          </div>
        </motion.div>

        {/* Transaction List */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 ml-1">Recent Activity</h3>
          {filteredTransactions.map((tx, index) => (
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
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p>No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
