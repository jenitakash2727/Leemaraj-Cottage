import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ScrollToTop from './components/Common/ScrollToTop';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Design system (imported via index.css → styles/global.css)

// Layout components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Pages
import HomePage           from './pages/HomePage';
import AboutPage          from './pages/AboutPage';
import RoomsPage          from './pages/RoomsPage';
import RoomDetailsPage    from './pages/RoomDetailsPage';
import GroupBookingPage   from './pages/GroupBookingPage';
import GroupDetailsPage   from './pages/GroupDetailsPage';
import AmenitiesPage      from './pages/AmenitiesPage';
import GalleryPage        from './pages/GalleryPage';
import CheckoutPage       from './pages/CheckoutPage';
import BookingSuccessPage from './pages/BookingSuccessPage';
import ContactPage        from './pages/ContactPage';
import LoginPage          from './pages/LoginPage';
import MyBookingsPage     from './pages/MyBookingsPage';

// Admin Pages
import ProtectedRoute     from './components/Common/ProtectedRoute';
import AdminLayout        from './pages/admin/AdminLayout';
import AdminDashboard     from './pages/admin/AdminDashboard';
import AdminBookings      from './pages/admin/AdminBookings';
import AdminRooms         from './pages/admin/AdminRooms';
import AdminGroupBooking  from './pages/admin/AdminGroupBooking';
import AdminGallery       from './pages/admin/AdminGallery';
import AdminPolicies      from './pages/admin/AdminPolicies';
import AdminEnquiries     from './pages/admin/AdminEnquiries';



import FloatingActions from './components/Common/FloatingActions';

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <FloatingActions />
    </>
  );
}

function App() {
  return (
    <div id="app-root">
      <ScrollToTop />
      <ToastContainer position="bottom-right" />
      <Routes>
        {/* Public pages */}
        <Route element={<PublicLayout />}>
          <Route path="/"               element={<HomePage />} />
        <Route path="/about"          element={<AboutPage />} />
        <Route path="/rooms"          element={<RoomsPage />} />
        <Route path="/rooms/:id"      element={<RoomDetailsPage />} />
        <Route path="/group-booking"  element={<GroupBookingPage />} />
        <Route path="/group-booking/details" element={<GroupDetailsPage />} />
        <Route path="/packages"       element={<Navigate to="/group-booking" replace />} />
        <Route path="/amenities"      element={<AmenitiesPage />} />
        <Route path="/gallery"        element={<GalleryPage />} />
        <Route path="/booking"        element={<Navigate to="/checkout" replace />} />
        <Route path="/booking-success" element={<BookingSuccessPage />} />
        <Route path="/contact"        element={<ContactPage />} />
        <Route path="/login"          element={<LoginPage />} />

        {/* Customer Routes (Protected) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Route>
        </Route>

        {/* Admin Routes (Protected) */}
        <Route element={<ProtectedRoute adminOnly={true} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="rooms" element={<AdminRooms />} />
            <Route path="group-booking" element={<AdminGroupBooking />} />
            <Route path="packages" element={<Navigate to="/admin/group-booking" replace />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="policies" element={<AdminPolicies />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
          </Route>
        </Route>

        {/* Legacy route redirects */}
        <Route path="/practice"       element={<Navigate to="/gallery" replace />} />
        <Route path="/signup"         element={<Navigate to="/login" replace />} />
        <Route path="/otp"            element={<Navigate to="/login" replace />} />
        <Route path="/loginpage"      element={<Navigate to="/login" replace />} />
        <Route path="/dashboard"      element={<Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<Navigate to="/login" replace />} />

        {/* Catch-all */}
        <Route path="*"               element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;