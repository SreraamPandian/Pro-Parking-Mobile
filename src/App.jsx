import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Login from './pages/Login';

// User Pages (Shared by Visitor & Staff)
import StaffHome from './pages/staff/StaffHome';
import StaffVehicles from './pages/staff/StaffVehicles';
import StaffProfile from './pages/staff/StaffProfile';
import StaffBooking from './pages/staff/StaffBooking';
import StaffPayment from './pages/staff/StaffPayment';
import StaffHistory from './pages/staff/StaffHistory';
import StaffNotifications from './pages/staff/StaffNotifications';

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
import { NotificationToast } from './components/ui/NotificationToast';

// Layout for Visitor and Staff
const UserLayout = ({ type }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);
  const [newBooking, setNewBooking] = useState(null);

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

  useEffect(() => {
    // Check if we've already shown the mock web booking this session
    const hasShown = sessionStorage.getItem('pro_parking_web_booking_shown');

    if (!hasShown && (location.pathname === `${basePath}/home`)) {
      const timer = setTimeout(() => {
        const mockBooking = {
          id: 'web-' + Date.now(),
          location: 'Location B',
          spot: 'B-12',
          date: 'Jan 09, 2026',
          time: '11:45 AM',
          duration: '3h',
          isWeb: true
        };

        setNewBooking(mockBooking);
        setShowNotification(true);
        sessionStorage.setItem('pro_parking_web_booking_shown', 'true');

        // Notification record for the List Page
        const mockNotif = {
          id: 'notif-' + Date.now(),
          type: 'web-booking',
          title: 'New Web Booking',
          message: `Booking received for ${mockBooking.location} at ${mockBooking.time}.`,
          time: 'Just now',
          unread: true,
          action: true,
          actionLabel: 'View Details',
          actionPath: `${basePath}/booking`
        };

        const savedNotifs = localStorage.getItem('pro_parking_notifications');
        const existingNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
        localStorage.setItem('pro_parking_notifications', JSON.stringify([mockNotif, ...existingNotifs]));

        // Inject into localStorage for persistence in Upcoming list
        const saved = localStorage.getItem('pro_parking_bookings');
        const existing = saved ? JSON.parse(saved) : [];
        const updated = [mockBooking, ...existing];
        localStorage.setItem('pro_parking_bookings', JSON.stringify(updated));

        // Trigger a custom event
        window.dispatchEvent(new Event('storage'));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname, basePath]);

  return (
    <div className="min-h-screen bg-gray-50">
      <NotificationToast
        show={showNotification}
        booking={newBooking}
        onClose={() => setShowNotification(false)}
        onView={() => {
          setShowNotification(false);
          navigate(`${basePath}/booking`);
        }}
      />
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
          <Route path="notifications" element={<StaffNotifications />} />
        </Route>

        {/* Staff Routes (New 3rd Portal) */}
        <Route path="/staff" element={<UserLayout type="staff" />}>
          <Route path="home" element={<StaffHome />} />
          <Route path="vehicles" element={<StaffVehicles />} />
          <Route path="profile" element={<StaffProfile />} />
          <Route path="booking" element={<StaffBooking />} />
          <Route path="payment" element={<StaffPayment />} />
          <Route path="history" element={<StaffHistory />} />
          <Route path="notifications" element={<StaffNotifications />} />
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
