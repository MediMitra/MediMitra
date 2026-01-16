import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context';
import { Navbar, PrivateRoute } from './components';

// Auth Pages
import { LoginSelection, LoginAdmin, LoginStore, LoginUser, Register } from './pages/auth';

// User Pages
import { Home, Medicines, Cart, Checkout, Orders } from './pages/user';

// Common Pages
import { Feedback, StoreLocator, PromoBanner, BrowseMedicines } from './pages/common';

// Dashboard Pages
import { AdminDashboard } from './pages/admin';
import { StoreDashboard } from './pages/store';

// Main App Component with conditional Navbar
function AppContent() {
  const { user } = useAuth();
  const location = window.location.pathname;
  const hideNavbarPages = ['/', '/home', '/login-selection', '/login', '/login-admin', '/login-store', '/login-user', '/register'];
  const showNavbar = !hideNavbarPages.includes(location);

  return (
    <div className="min-h-screen bg-white">
      {/* Show Navbar on all pages except auth/home pages */}
      {showNavbar && <Navbar />}
      
      <main className={showNavbar ? "container mx-auto px-4 py-8" : ""}>
        <Routes>
          {/* Public Routes - No Navbar */}
          <Route path="/" element={user ? <Navigate to="/medicines" /> : <Home />} />
          <Route path="/home" element={user ? <Navigate to="/medicines" /> : <Home />} />
          <Route path="/browse-medicines" element={<BrowseMedicines />} />
          <Route path="/login-selection" element={user ? <Navigate to="/medicines" /> : <LoginSelection />} />
          <Route path="/login" element={user ? <Navigate to="/medicines" /> : <LoginSelection />} />
          <Route path="/login-admin" element={user ? <Navigate to="/admin" /> : <LoginAdmin />} />
          <Route path="/login-store" element={user ? <Navigate to="/store" /> : <LoginStore />} />
          <Route path="/login-user" element={user ? <Navigate to="/medicines" /> : <LoginUser />} />
          <Route path="/register" element={user ? <Navigate to="/medicines" /> : <Register />} />
          
          {/* Public Access Routes */}
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/store-locator" element={<StoreLocator />} />
          <Route path="/medicines" element={<Medicines />} />
          
          {/* Protected Routes - With Navbar */}
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          <Route path="/store" element={<PrivateRoute><StoreDashboard /></PrivateRoute>} />
          <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
