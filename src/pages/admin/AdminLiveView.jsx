import React, { useState } from 'react';
import { Search, Clock, Car } from 'lucide-react';
import { Input } from '../../components/ui/Input';

const cars = [
  { id: 1, plate: 'ABC-1234', entry: '08:30 AM', duration: '2h 15m', location: 'Area A-12', status: 'active' },
  { id: 2, plate: 'XYZ-9876', entry: '09:15 AM', duration: '45m', location: 'Area B-05', status: 'active' },
  { id: 3, plate: 'LMN-4567', entry: '05:00 AM', duration: '5h 30m', location: 'Area A-08', status: 'overdue' },
  { id: 4, plate: 'PQR-1122', entry: '10:00 AM', duration: '10m', location: 'Area C-01', status: 'active' },
  { id: 5, plate: 'STU-9988', entry: '09:00 AM', duration: '1h 05m', location: 'Area B-11', status: 'active' },
];

export default function AdminLiveView() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCars = cars.filter(car =>
    car.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 pb-32 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Live Parking</h1>
        <p className="text-gray-500">Real-time Vehicle Status</p>
      </header>

      {/* Summary Stats Cards - Matching Image */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50/60 p-5 rounded-[2rem] border border-blue-100/40">
          <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.1em] mb-1">Total Slots</p>
          <p className="text-3xl font-black text-blue-800">100</p>
        </div>
        <div className="bg-green-50/60 p-5 rounded-[2rem] border border-green-100/40">
          <p className="text-[10px] font-black text-green-500 uppercase tracking-[0.1em] mb-1">Available</p>
          <p className="text-3xl font-black text-green-800">25</p>
        </div>
        <div className="bg-[#FFFBEB] p-5 rounded-[2rem] border border-amber-100/40">
          <p className="text-[10px] font-black text-[#B45309] uppercase tracking-[0.1em] mb-1">Reserved</p>
          <p className="text-3xl font-black text-[#92400E]">20</p>
        </div>
        <div className="bg-red-50/60 p-5 rounded-[2rem] border border-red-100/40">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.1em] mb-1">Occupied</p>
          <p className="text-3xl font-black text-red-800">55</p>
        </div>
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search license plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Filter button removed as requested */}
      </div>

      <div className="space-y-3">
        {filteredCars.map((car) => (
          <div key={car.id} className="bg-white p-4 rounded-2xl shadow-soft flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors
                ${car.status === 'overdue' ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-600'}`}>
                <Car size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{car.plate}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>Entry: {car.entry}</span>
                  <span>•</span>
                  <span className="font-medium text-brand-600">{car.location}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end text-sm font-bold text-gray-900">
                <Clock size={14} className="text-gray-400" />
                {car.duration}
              </div>
              <p className={`text-xs font-bold mt-1 ${car.status === 'overdue' ? 'text-red-500' : 'text-green-500'}`}>
                {car.status === 'overdue' ? 'Overdue' : 'Active'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
