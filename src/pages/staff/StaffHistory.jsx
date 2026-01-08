import React from 'react';
import { ChevronLeft, MapPin, Clock, CreditCard, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const historyData = [
  { id: 1, date: 'Today, 10:30 AM', location: 'Area A - Spot 12', duration: '2h 45m', amount: '12.50', method: 'Apple Pay', vehicle: 'Tesla Model 3' },
  { id: 2, date: 'Yesterday, 08:15 AM', location: 'Area B - Spot 05', duration: '8h 00m', amount: '24.00', method: 'Credit Card', vehicle: 'Toyota Camry' },
  { id: 3, date: 'Dec 20, 2024', location: 'Area A - Spot 08', duration: '1h 30m', amount: '8.50', method: 'Cash', vehicle: 'Tesla Model 3' },
  { id: 4, date: 'Dec 18, 2024', location: 'Area C - Spot 01', duration: '45m', amount: '5.00', method: 'Google Pay', vehicle: 'Toyota Camry' },
];

export default function StaffHistory() {
  const navigate = useNavigate();

  return (
    <div className="p-6 pb-32 space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">History</h1>
          <p className="text-gray-500">Past Parking Sessions</p>
        </div>
      </header>

      <div className="space-y-4">
        {historyData.map((item) => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                <Calendar size={14} />
                {item.date}
              </div>
              <span className="font-bold text-lg text-gray-900">${item.amount}</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center text-brand-600">
                  <MapPin size={16} />
                </div>
                <span className="font-medium text-gray-900">{item.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Clock size={16} />
                </div>
                <span className="text-gray-600">{item.duration}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                  <CreditCard size={16} />
                </div>
                <span className="text-gray-600">{item.method} • {item.vehicle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
