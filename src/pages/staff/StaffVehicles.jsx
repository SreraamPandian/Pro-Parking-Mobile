import React, { useState } from 'react';
import { Car, Plus, ShieldCheck, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

const initialVehicles = [
  { id: 1, name: 'Tesla Model 3', plate: 'ABC-1234', color: 'White', status: 'Verified' },
  { id: 2, name: 'Toyota Camry', plate: 'XYZ-9876', color: 'Silver', status: 'Verified' },
];

export default function StaffVehicles() {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({ plate: '' });

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const vehicle = {
      id: Date.now(),
      name: 'New Vehicle',
      plate: newVehicle.plate,
      color: 'Unknown',
      status: 'Pending',
    };
    setVehicles([...vehicles, vehicle]);
    setShowAddModal(false);
    setNewVehicle({ plate: '' });
  };

  return (
    <div className="p-6 pb-32 space-y-6 relative min-h-screen">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Vehicles</h1>
          <p className="text-gray-500">Registered Cars</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-10 h-10 bg-brand-900 text-white rounded-full flex items-center justify-center shadow-lg shadow-brand-900/20 active:scale-95 transition-transform"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="space-y-4">
        {vehicles.map((car) => (
          <div key={car.id} className="bg-white p-5 rounded-2xl shadow-soft border border-gray-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                <Car size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{car.name}</h3>
                <p className="text-sm text-gray-500">{car.plate} {car.color !== 'Unknown' && `• ${car.color}`}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${car.status === 'Verified' ? 'text-green-600 bg-green-50' : 'text-amber-600 bg-amber-50'}`}>
                <ShieldCheck size={12} /> {car.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal - Increased Z-Index to be above BottomNav (z-50) */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-[2rem] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Vehicle</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleAddVehicle} className="space-y-4">
                <Input 
                  icon={Car}
                  label="License Plate"
                  placeholder="ABC-1234"
                  value={newVehicle.plate}
                  onChange={(e) => setNewVehicle({...newVehicle, plate: e.target.value})}
                  required
                />
                {/* Mobile Number Removed */}
                <Button type="submit" className="mt-4">Register Vehicle</Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
