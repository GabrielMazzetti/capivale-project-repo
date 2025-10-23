import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Auth Pages
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';

// Landing Page
import { LandingPage } from '../pages/LandingPage';

// User Pages
import { UserDashboard } from '../pages/user/Dashboard';

// Merchant Pages
import { MerchantDashboard } from '../pages/merchant/Dashboard';
import Products from '../pages/merchant/Products';
import PointOfSale from '../pages/merchant/PointOfSale';
import SalesHistory from '../pages/merchant/SalesHistory';
import Profile from '../pages/merchant/Profile';

// Admin Pages
import AdminLayout from '../pages/admin/AdminLayout';
import { AdminDashboard } from '../pages/admin/Dashboard';
import { UserManagement } from '../pages/admin/UserManagement';
import { PlatformTransactions } from '../pages/admin/PlatformTransactions';
import FAQManagement from '../pages/admin/FAQManagement';
import CategoryManagement from '../pages/admin/CategoryManagement'; // Add this import
import ActivityManagement from '../pages/admin/ActivityManagement';
import Mining from '../pages/user/Mining';

/**
 * A component to protect routes that require authentication.
 * If the user is not authenticated, they are redirected to the login page.
 */
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

/**
 * Main application router defining all public and private routes.
 */
const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Root Route: Landing Page for unauthenticated users, Dashboard for authenticated */}
      <Route 
        path="/" 
        element={
          user ? (
            user.role === 'admin' ? <Navigate to="/admin" /> :
            user.role === 'merchant' ? <Navigate to="/merchant" /> :
            <Navigate to="/dashboard" />
          ) : (
            <LandingPage />
          )
        }
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/merchant" element={<MerchantDashboard />} />
        <Route path="/merchant/products" element={<Products />} />
        <Route path="/merchant/pos" element={<PointOfSale />} />
        <Route path="/merchant/history" element={<SalesHistory />} />
        <Route path="/merchant/profile" element={<Profile />} />
        <Route path="/mining" element={<Mining />} />

        {/* Admin Routes with dedicated layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="transactions" element={<PlatformTransactions />} />
          <Route path="faq" element={<FAQManagement />} />
          <Route path="categories" element={<CategoryManagement />} /> {/* Add this route */}
          <Route path="activities" element={<ActivityManagement />} />
        </Route>
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRouter;
