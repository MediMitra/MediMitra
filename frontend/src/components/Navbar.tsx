import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string): boolean => location.pathname === path;

  const getLinkClass = (path: string): string => {
    return `px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
      isActive(path)
        ? 'bg-primary-600 text-white shadow-md'
        : 'text-gray-700 hover:text-primary-600 hover:bg-primary-50'
    }`;
  };

  const getRoleBasedLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/medicines" className={getLinkClass('/medicines')}>
            💊 Browse Medicines
          </Link>
          <Link to="/store-locator" className={getLinkClass('/store-locator')}>
            📍 Find Stores
          </Link>
        </>
      );
    }

    switch (user.role) {
      case 'admin':
        return (
          <>
            <Link to="/admin?tab=analytics" className={getLinkClass('/admin')}>
              📊 Analytics
            </Link>
            <Link to="/admin?tab=medicines" className={getLinkClass('/admin')}>
              💊 Medicines
            </Link>
            <Link to="/admin?tab=stores" className={getLinkClass('/admin')}>
              🏪 Stores
            </Link>
          </>
        );
      case 'store':
        return (
          <>
            <Link to="/store" className={getLinkClass('/store')}>
              🏪 Dashboard
            </Link>
            <Link to="/medicines" className={getLinkClass('/medicines')}>
              💊 Medicines
            </Link>
            <Link to="/store-locator" className={getLinkClass('/store-locator')}>
              📍 Find Stores
            </Link>
          </>
        );
      default:
        return (
          <>
            <Link to="/medicines" className={getLinkClass('/medicines')}>
              💊 Medicines
            </Link>
            <Link to="/cart" className={getLinkClass('/cart')}>
              🛒 Cart
            </Link>
            <Link to="/orders" className={getLinkClass('/orders')}>
              📦 Orders
            </Link>
            <Link to="/store-locator" className={getLinkClass('/store-locator')}>
              📍 Find Stores
            </Link>
          </>
        );
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="container-custom">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="transform group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/logo.png" 
                alt="MediMitra Logo" 
                className="h-14 w-auto object-contain"
              />
            </div>
            <div>
              <span className="text-2xl font-heading font-bold text-gray-900 block">MediMitra</span>
              <span className="text-xs text-primary-600 font-medium">Your Trusted Healthcare Partner</span>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {getRoleBasedLinks()}
            
            {user ? (
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l-2 border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-6">
                <Link to="/login" className="bg-primary-600 text-white hover:bg-primary-700 px-6 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
                  Sign In
                </Link>
                <Link to="/register" className="bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 px-6 py-2 rounded-lg font-semibold transition-all duration-300">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t-2 border-gray-100">
            <div className="flex flex-col space-y-2">
              {getRoleBasedLinks()}
              
              {user ? (
                <div className="pt-4 border-t-2 border-gray-100 mt-2">
                  <div className="flex items-center gap-3 mb-4 px-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout} 
                    className="btn bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 w-full"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-2 pt-4 border-t-2 border-gray-100 mt-2">
                  <Link to="/login" className="btn btn-primary">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn btn-outline">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
