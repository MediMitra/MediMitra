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
    return `px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
      isActive(path)
        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
        : 'text-gray-700 hover:bg-gray-100'
    }`;
  };

  const getRoleBasedLinks = () => {
    if (!user) {
      return (
        <>
          <Link to="/medicines" className={getLinkClass('/medicines')}>
            💊 Medicines
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
    <nav className="bg-white shadow-lg sticky top-0 z-50 backdrop-blur-lg bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <span className="text-3xl font-bold gradient-text">MediMitra</span>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {getRoleBasedLinks()}
            
            {user ? (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l-2 border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block">
                    <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="btn bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link to="/login" className="btn btn-primary">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-outline">
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
