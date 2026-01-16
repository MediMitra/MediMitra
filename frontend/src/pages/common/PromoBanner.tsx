import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function PromoBanner() {
  const navigate = useNavigate();

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
      description: 'Get 24/7 delivery service right at your doorstep',
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-600/80"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-block mb-6">
              <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg border border-white/30">
                ✨ India's Most Trusted Healthcare Platform
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white">
              Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">MediMitra</span>
            </h1>
            <p className="text-2xl md:text-3xl mb-4 text-white font-medium">
              Your Trusted Partner in Healthcare
            </p>
            <p className="text-lg mb-12 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Access quality medicines from verified pharmacies, delivered to your doorstep with care and precision.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/browse-medicines')}
                className="bg-white text-blue-600 px-8 py-4 rounded-xl text-base font-semibold hover:shadow-2xl transition-all shadow-lg"
              >
                Browse Medicines
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login-user')}
                className="bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-white/30 transition-all"
              >
                Get Started
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/store-locator')}
                className="bg-white/10 backdrop-blur-sm border-2 border-white/20 text-white px-8 py-4 rounded-xl text-base font-semibold hover:bg-white/20 transition-all"
              >
                Find Stores
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xl hover:shadow-2xl transition-all"
            >
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Features Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-600 mb-3">Why Choose MediMitra?</h2>
            <p className="text-gray-600">Experience healthcare at its finest with our comprehensive features</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const isBlue = index % 2 === 0;
              const colorClasses = isBlue 
                ? {
                    blur: 'from-blue-200/30 to-blue-400/30',
                    border: 'hover:border-blue-300',
                    iconBg: 'from-blue-100 to-blue-200',
                    iconText: 'text-blue-600'
                  }
                : {
                    blur: 'from-green-200/30 to-green-400/30',
                    border: 'hover:border-green-300',
                    iconBg: 'from-green-100 to-green-200',
                    iconText: 'text-green-600'
                  };
              
              return (
              <div
                key={index}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colorClasses.blur} rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-all`}></div>
                <div className={`relative bg-white/80 backdrop-blur-md p-6 rounded-xl border-2 border-white/70 ${colorClasses.border} hover:shadow-xl transition-all duration-300`}>
                  <div className={`w-14 h-14 bg-gradient-to-br ${colorClasses.iconBg} rounded-lg flex items-center justify-center ${colorClasses.iconText} mb-4 border border-${isBlue ? 'blue' : 'green'}-200/50 shadow-sm`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center mb-16">
          <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-md"></div>
          <div className="mx-4 text-orange-400">✦</div>
          <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-md"></div>
        </div>

        {/* Role-Based Quick Access */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Portal Access</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.button
              onClick={() => navigate('/login-admin')}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                  👨‍💼
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Admin Portal</h3>
                  <p className="text-xs text-gray-500">Manage Platform</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Control medicines, stores, and monitor overall platform activities.
              </p>
              <div className="flex items-center text-red-600 font-medium group-hover:gap-2 transition-all">
                Access Portal
                <svg className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>

            <motion.button
              onClick={() => navigate('/login-store')}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                  🏪
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Store Portal</h3>
                  <p className="text-xs text-gray-500">Manage Inventory</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Track inventory, manage customers, and handle orders efficiently.
              </p>
              <div className="flex items-center text-teal-600 font-medium group-hover:gap-2 transition-all">
                Access Portal
                <svg className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>

            <motion.button
              onClick={() => navigate('/login-user')}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="group text-left bg-white rounded-2xl shadow-xl border border-gray-100 p-6 hover:shadow-2xl transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                  👤
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Customer Portal</h3>
                  <p className="text-xs text-gray-500">Shop Medicines</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Browse, search, and purchase medicines with ease and convenience.
              </p>
              <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                Start Shopping
                <svg className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-12 text-center text-white shadow-2xl border border-green-400"
        >
          <h2 className="text-4xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-xl mb-8 text-green-50">
            Join thousands of satisfied customers who trust MediMitra for their healthcare needs
          </p>
          <motion.button
            onClick={() => navigate('/register')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-green-600 hover:bg-gray-50 px-10 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Create Account Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
