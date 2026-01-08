import React from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import Login from './pages/Login';

// User Pages (Shared by Visitor & Staff)
import StaffHome from './pages/staff/StaffHome';
import StaffVehicles from './pages/staff/StaffVehicles';
import StaffProfile from './pages/staff/StaffProfile';
import StaffBooking from './pages/staff/StaffBooking';
import StaffPayment from './pages/staff/StaffPayment';
import StaffHistory from './pages/staff/StaffHistory';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLiveView from './pages/admin/AdminLiveView';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';
import AdminScanner from './pages/admin/AdminScanner';
import AdminTransactions from './pages/admin/AdminTransactions'; // New Import

// Components
import { BottomNav } from './components/layout/BottomNav';
import { Home, Car, User, LayoutDashboard, List, FileText, Settings, MapPin, ScanLine } from 'lucide-react';

// Layout for Visitor and Staff
const UserLayout = ({ type }) => {
  const location = useLocation();
  // Determine base path based on type
  const basePath = type === 'visitor' ? '/visitor' : '/staff';
  
  const hideNav = location.pathname === `${basePath}/payment` || location.pathname === `${basePath}/history`;

  const navItems = [
    { icon: Home, label: 'Pass', path: `${basePath}/home` },
    { icon: MapPin, label: 'Book', path: `${basePath}/booking` },
    { icon: ScanLine, label: 'Pay', path: `${basePath}/payment` },
    { icon: Car, label: 'Vehicles', path: `${basePath}/vehicles` },
    { icon: User, label: 'Profile', path: `${basePath}/profile` },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet context={{ type }} />
      {!hideNav && <BottomNav items={navItems} />}
    </div>
  );
};

const AdminLayout = () => {
  const location = useLocation();
  const hideNav = location.pathname === '/admin/scanner';

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: List, label: 'Live View', path: '/admin/live-view' },
    { icon: FileText, label: 'Reports', path: '/admin/reports' }, // Kept as Reports for Nav
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
      {!hideNav && <BottomNav items={navItems} />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Visitor Routes */}
        <Route path="/visitor" element={<UserLayout type="visitor" />}>
          <Route path="home" element={<StaffHome />} />
          <Route path="vehicles" element={<StaffVehicles />} />
          <Route path="profile" element={<StaffProfile />} />
          <Route path="booking" element={<StaffBooking />} />
          <Route path="payment" element={<StaffPayment />} />
          <Route path="history" element={<StaffHistory />} />
        </Route>

        {/* Staff Routes (New 3rd Portal) */}
        <Route path="/staff" element={<UserLayout type="staff" />}>
          <Route path="home" element={<StaffHome />} />
          <Route path="vehicles" element={<StaffVehicles />} />
          <Route path="profile" element={<StaffProfile />} />
          <Route path="booking" element={<StaffBooking />} />
          <Route path="payment" element={<StaffPayment />} />
          <Route path="history" element={<StaffHistory />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="live-view" element={<AdminLiveView />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="transactions" element={<AdminTransactions />} /> {/* New Route */}
          <Route path="settings" element={<AdminSettings />} />
          <Route path="scanner" element={<AdminScanner />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
