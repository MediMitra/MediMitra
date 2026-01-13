import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Home() {
  const { user } = useAuth();

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      title: 'Easy Search',
      description: 'Find medicines quickly with our powerful search engine',
      color: 'primary'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Fast Delivery',
      description: '24/7 delivery service at your doorstep',
      color: 'secondary'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Quality Assured',
      description: 'All medicines are verified and quality tested',
      color: 'accent'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Best Prices',
      description: 'Competitive pricing with regular discounts',
      color: 'primary'
    }
  ];

  const stats = [
    { number: '500+', label: 'Medicines', color: 'primary' },
    { number: '50+', label: 'Pharmacies', color: 'secondary' },
    { number: '10K+', label: 'Happy Customers', color: 'accent' },
    { number: '24/7', label: 'Support', color: 'primary' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600 rounded-3xl mb-12 shadow-2xl">
        <div className="absolute inset-0 bg-white bg-opacity-10 backdrop-blur-sm"></div>
        <div className="relative px-8 py-16 md:py-24 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              Welcome to <span className="text-yellow-300">MediMitra</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white text-opacity-90">
              Your Trusted Partner in Healthcare
            </p>
            <p className="text-lg mb-10 text-white text-opacity-80 max-w-2xl mx-auto">
              Access quality medicines from verified pharmacies, delivered to your doorstep with care and precision.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              {!user ? (
                <>
                  <Link to="/medicines" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8">
                    Browse Medicines
                  </Link>
                  <Link to="/login-selection" className="btn bg-primary-800 bg-opacity-50 backdrop-blur-sm hover:bg-opacity-70 text-white text-lg px-8">
                    Get Started
                  </Link>
                  <Link to="/store-locator" className="btn bg-accent-600 bg-opacity-80 backdrop-blur-sm hover:bg-opacity-100 text-white text-lg px-8">
                    Find Stores
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/medicines" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8">
                    Browse Medicines
                  </Link>
                  <Link to="/store-locator" className="btn bg-accent-600 bg-opacity-80 backdrop-blur-sm hover:bg-opacity-100 text-white text-lg px-8">
                    Find Stores
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white bg-opacity-10 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-2xl p-6 text-center text-white shadow-lg transform hover:scale-105 transition-all duration-300`}
          >
            <div className="text-4xl font-bold mb-2">{stat.number}</div>
            <div className="text-sm opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Features Section */}
      <div className="mb-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold gradient-text mb-4">Why Choose MediMitra?</h2>
          <p className="text-gray-600 text-lg">Experience healthcare at its finest with our comprehensive features</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className={`w-16 h-16 bg-gradient-to-br from-${feature.color}-500 to-${feature.color}-600 rounded-2xl flex items-center justify-center text-white mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role-Based Quick Access */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-12">
        <h2 className="text-3xl font-bold text-center gradient-text mb-8">Portal Access</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link to="/admin" className="group">
            <div className="card hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary-400">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                  👨‍💼
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Admin Portal</h3>
                  <p className="text-sm text-gray-500">Manage Platform</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Control medicines, stores, and monitor overall platform activities.
              </p>
              <div className="flex items-center text-primary-600 font-semibold group-hover:gap-2 transition-all">
                Access Portal
                <svg className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link to="/store" className="group">
            <div className="card hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-secondary-400">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                  🏪
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Store Portal</h3>
                  <p className="text-sm text-gray-500">Manage Inventory</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Track inventory, manage customers, and handle orders efficiently.
              </p>
              <div className="flex items-center text-secondary-600 font-semibold group-hover:gap-2 transition-all">
                Access Portal
                <svg className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link to="/medicines" className="group">
            <div className="card hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-accent-400">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                  👤
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Customer Portal</h3>
                  <p className="text-sm text-gray-500">Shop Medicines</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Browse, search, and purchase medicines with ease and convenience.
              </p>
              <div className="flex items-center text-accent-600 font-semibold group-hover:gap-2 transition-all">
                Start Shopping
                <svg className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 rounded-3xl p-12 text-center text-white shadow-xl">
        <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="text-xl mb-8 text-white text-opacity-90">
          Join thousands of satisfied customers who trust MediMitra for their healthcare needs
        </p>
        {!user && (
          <Link to="/register" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-10">
            Create Account Now
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;
