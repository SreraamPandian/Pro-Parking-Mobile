import React, { useState, useRef, useEffect } from 'react';
import { DollarSign, Banknote, CreditCard, ChevronDown, ArrowLeft } from 'lucide-react';
import { ApplePayLogo, GooglePayLogo, VisaLogo, MastercardLogo } from '../../components/ui/PaymentLogos';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Mock Data with Dates - Comprehensive data for all filters
// Assuming today is 2026-01-12
const transactions = [
  // Today (2026-01-12) - All payment methods including Card
  { id: 1, method: 'Apple Pay', amount: '12.50', time: '2:30 PM', date: '2026-01-12', vehicle: 'ABC-1234', dept: 'Visitor', status: 'success' },
  { id: 2, method: 'Cash', amount: '8.00', time: '2:15 PM', date: '2026-01-12', vehicle: 'XYZ-9876', dept: 'Staff', status: 'success' },
  { id: 3, method: 'Visa', amount: '24.00', time: '1:55 PM', date: '2026-01-12', vehicle: 'LMN-4567', dept: 'Visitor', status: 'success' },
  { id: 4, method: 'Google Pay', amount: '15.50', time: '11:30 AM', date: '2026-01-12', vehicle: 'PQR-1122', dept: 'Visitor', status: 'success' },
  { id: 5, method: 'Mastercard', amount: '10.00', time: '10:45 AM', date: '2026-01-12', vehicle: 'STU-9988', dept: 'Visitor', status: 'success' },
  { id: 6, method: 'Waiver', amount: '0.00', time: '10:00 AM', date: '2026-01-12', vehicle: 'VIP-100', dept: 'VIP', status: 'success' },
  { id: 7, method: 'Card', amount: '18.00', time: '9:30 AM', date: '2026-01-12', vehicle: 'DEF-5678', dept: 'Visitor', status: 'success' },

  // Yesterday (2026-01-11) - Mixed methods and departments
  { id: 8, method: 'Cash', amount: '5.00', time: '4:30 PM', date: '2026-01-11', vehicle: 'JKL-5544', dept: 'Staff', status: 'success' },
  { id: 9, method: 'Apple Pay', amount: '18.00', time: '3:15 PM', date: '2026-01-11', vehicle: 'MNO-7788', dept: 'Visitor', status: 'success' },
  { id: 10, method: 'Waiver', amount: '0.00', time: '2:00 PM', date: '2026-01-11', vehicle: 'VIP-001', dept: 'VIP', status: 'success' },
  { id: 11, method: 'Visa', amount: '22.00', time: '12:30 PM', date: '2026-01-11', vehicle: 'DEF-3344', dept: 'Visitor', status: 'success' },
  { id: 12, method: 'Google Pay', amount: '14.00', time: '11:00 AM', date: '2026-01-11', vehicle: 'GHI-6677', dept: 'Staff', status: 'success' },
  { id: 13, method: 'Mastercard', amount: '16.00', time: '10:15 AM', date: '2026-01-11', vehicle: 'JKL-8899', dept: 'Visitor', status: 'success' },
  { id: 14, method: 'Card', amount: '20.00', time: '9:00 AM', date: '2026-01-11', vehicle: 'QRS-1234', dept: 'Staff', status: 'success' },

  // This Week (2026-01-06 to 2026-01-10) - All departments
  { id: 15, method: 'Google Pay', amount: '14.50', time: '5:00 PM', date: '2026-01-10', vehicle: 'GHI-6677', dept: 'Visitor', status: 'success' },
  { id: 16, method: 'Cash', amount: '7.00', time: '3:45 PM', date: '2026-01-10', vehicle: 'TUV-2233', dept: 'Staff', status: 'success' },
  { id: 17, method: 'Mastercard', amount: '20.00', time: '1:20 PM', date: '2026-01-09', vehicle: 'WXY-4455', dept: 'Visitor', status: 'success' },
  { id: 18, method: 'Apple Pay', amount: '16.00', time: '11:00 AM', date: '2026-01-09', vehicle: 'ZAB-6688', dept: 'Visitor', status: 'success' },
  { id: 19, method: 'Waiver', amount: '0.00', time: '10:30 AM', date: '2026-01-09', vehicle: 'VIP-200', dept: 'VIP', status: 'success' },
  { id: 20, method: 'Cash', amount: '6.50', time: '4:15 PM', date: '2026-01-08', vehicle: 'CDE-9900', dept: 'Staff', status: 'success' },
  { id: 21, method: 'Visa', amount: '25.00', time: '2:30 PM', date: '2026-01-08', vehicle: 'FGH-1122', dept: 'Visitor', status: 'success' },
  { id: 22, method: 'Google Pay', amount: '13.00', time: '10:15 AM', date: '2026-01-07', vehicle: 'IJK-3344', dept: 'Visitor', status: 'success' },
  { id: 23, method: 'Cash', amount: '9.00', time: '3:00 PM', date: '2026-01-06', vehicle: 'LMN-5566', dept: 'Staff', status: 'success' },
  { id: 24, method: 'Mastercard', amount: '12.00', time: '1:45 PM', date: '2026-01-06', vehicle: 'NOP-7788', dept: 'Visitor', status: 'success' },
  { id: 25, method: 'Card', amount: '15.00', time: '11:30 AM', date: '2026-01-07', vehicle: 'TUV-9999', dept: 'VIP', status: 'success' },

  // Earlier dates (before this week) - All methods
  { id: 26, method: 'Apple Pay', amount: '11.50', time: '2:45 PM', date: '2026-01-05', vehicle: 'OPQ-7788', dept: 'Visitor', status: 'success' },
  { id: 27, method: 'Mastercard', amount: '19.00', time: '1:30 PM', date: '2026-01-04', vehicle: 'RST-9900', dept: 'Visitor', status: 'success' },
  { id: 28, method: 'Cash', amount: '8.50', time: '11:45 AM', date: '2026-01-03', vehicle: 'UVW-1122', dept: 'Staff', status: 'success' },
  { id: 29, method: 'Visa', amount: '23.00', time: '4:00 PM', date: '2026-01-02', vehicle: 'XYZ-3344', dept: 'Visitor', status: 'success' },
  { id: 30, method: 'Google Pay', amount: '17.50', time: '2:15 PM', date: '2026-01-01', vehicle: 'ABC-5566', dept: 'Visitor', status: 'failed' },
  { id: 31, method: 'Waiver', amount: '0.00', time: '12:00 PM', date: '2026-01-01', vehicle: 'VIP-300', dept: 'VIP', status: 'success' },
  { id: 32, method: 'Card', amount: '21.00', time: '10:00 AM', date: '2026-01-03', vehicle: 'WXY-7777', dept: 'Visitor', status: 'success' },
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

  // Custom Range State
  const [customRange, setCustomRange] = useState({ start: '', end: '' });

  // Filter Logic
  const filteredTransactions = transactions.filter(tx => {
    // 1. Method Filter
    if (methodFilter !== 'All' && !tx.method.includes(methodFilter)) return false;

    // 2. Department Filter
    if (deptFilter !== 'All' && tx.dept !== deptFilter) return false;

    // 3. Date Filter Logic
    const today = new Date('2026-01-12'); // Reference date (current date)
    const txDate = new Date(tx.date);

    if (dateFilter === 'Today') {
      if (tx.date !== '2026-01-12') return false;
    } else if (dateFilter === 'Yesterday') {
      if (tx.date !== '2026-01-11') return false;
    } else if (dateFilter === 'This Week') {
      // This week starts from Monday 2026-01-06
      const weekStart = new Date('2026-01-06');
      if (txDate < weekStart || txDate > today) return false;
    } else if (dateFilter === 'Custom Range') {
      if (!customRange.start || !customRange.end) return true;
      const start = new Date(customRange.start);
      const end = new Date(customRange.end);
      if (txDate < start || txDate > end) return false;
    }

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
    if (method === 'Card') return <CreditCard size={20} className="text-blue-600" />;
    if (method === 'Waiver') return <CreditCard size={20} className="text-gray-400" />;
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

        {/* Custom Range Inputs */}
        <AnimatePresence>
          {dateFilter === 'Custom Range' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-4 overflow-hidden"
            >
              <div className="flex-1">
                <input
                  type="date"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-500"
                  value={customRange.start}
                  onChange={(e) => setCustomRange({ ...customRange, start: e.target.value })}
                />
              </div>
              <span className="text-gray-400 font-bold">to</span>
              <div className="flex-1">
                <input
                  type="date"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-brand-500"
                  value={customRange.end}
                  onChange={(e) => setCustomRange({ ...customRange, end: e.target.value })}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
