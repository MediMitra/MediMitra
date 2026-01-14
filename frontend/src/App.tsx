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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      {/* Only show Navbar when user is logged in */}
      {user && <Navbar />}
      
      <main className={user ? "container mx-auto px-4 py-8" : ""}>
        <Routes>
          {/* Public Routes - No Navbar */}
          <Route path="/" element={user ? <Navigate to="/medicines" /> : <PromoBanner />} />
          <Route path="/browse-medicines" element={<BrowseMedicines />} />
          <Route path="/login-admin" element={user ? <Navigate to="/admin" /> : <LoginAdmin />} />
          <Route path="/login-store" element={user ? <Navigate to="/store" /> : <LoginStore />} />
          <Route path="/login-user" element={user ? <Navigate to="/medicines" /> : <LoginUser />} />
          <Route path="/register" element={user ? <Navigate to="/medicines" /> : <Register />} />
          <Route path="/home" element={user ? <Navigate to="/medicines" /> : <Home />} />
          
          {/* Protected Routes - With Navbar */}
          <Route path="/medicines" element={<PrivateRoute><Medicines /></PrivateRoute>} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/store-locator" element={<StoreLocator />} />
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
