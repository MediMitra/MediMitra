import { useNavigate } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-50">
      {/* Decorative top elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-orange-200/30 to-orange-300/30 rounded-full blur-3xl"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-orange-200/30 rounded-full blur-3xl"></div>
      
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg">
              ✨ India's Most Trusted Healthcare Platform
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900">
            Welcome to <span className="bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">MediMitra</span>
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-gray-700 font-medium">
            Your Trusted Partner in Healthcare
          </p>
          <p className="text-base mb-12 text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Access quality medicines from verified pharmacies, delivered to your doorstep with care and precision.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/browse-medicines')}
              className="bg-gradient-to-r from-orange-400 to-orange-600 text-white px-8 py-3 rounded-lg text-base font-medium hover:shadow-xl transition-all shadow-md transform hover:-translate-y-0.5"
            >
              Browse Medicines
            </button>
            <button
              onClick={() => navigate('/login-user')}
              className="bg-white/90 backdrop-blur-sm border-2 border-orange-300 text-gray-800 px-8 py-3 rounded-lg text-base font-medium hover:bg-white hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
            <button
              onClick={() => navigate('/store-locator')}
              className="bg-white/70 backdrop-blur-sm border-2 border-orange-200 text-orange-600 px-8 py-3 rounded-lg text-base font-medium hover:bg-white hover:border-orange-400 transition-all transform hover:-translate-y-0.5"
            >
              Find Stores
            </button>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center mb-20">
          <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-md"></div>
          <div className="mx-4 text-orange-400">✦</div>
          <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-md"></div>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-300/20 to-orange-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
              <div className="relative text-center bg-white/80 backdrop-blur-lg rounded-xl p-6 border-2 border-white/60 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Decorative Divider */}
        <div className="flex items-center justify-center mb-16">
          <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-md"></div>
          <div className="mx-4 text-orange-400">❖</div>
          <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-md"></div>
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
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent mb-12">Portal Access</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <button onClick={() => navigate('/login-admin')} className="group text-left">
              <div className="relative overflow-hidden bg-white/80 backdrop-blur-md p-6 rounded-xl border-2 border-orange-200/60 hover:border-orange-400 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-200/30 to-orange-300/30 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div className="relative flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                    👨‍💼
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Admin Portal</h3>
                    <p className="text-xs text-gray-500">Manage Platform</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Control medicines, stores, and monitor overall platform activities.
                </p>
                <div className="flex items-center text-orange-600 font-medium group-hover:gap-2 transition-all">
                  Access Portal
                  <svg className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            <button onClick={() => navigate('/login-store')} className="group text-left">
              <div className="relative overflow-hidden bg-white/80 backdrop-blur-md p-6 rounded-xl border-2 border-blue-300/60 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-300/30 to-blue-400/30 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div className="relative flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                    🏪
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Store Portal</h3>
                    <p className="text-xs text-gray-500">Manage Inventory</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Track inventory, manage customers, and handle orders efficiently.
                </p>
                <div className="flex items-center text-blue-600 font-medium group-hover:gap-2 transition-all">
                  Access Portal
                  <svg className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            <button onClick={() => navigate('/login-user')} className="group text-left">
              <div className="relative overflow-hidden bg-white/80 backdrop-blur-md p-6 rounded-xl border-2 border-green-300/60 hover:border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-300/30 to-green-400/30 rounded-full blur-2xl -mr-16 -mt-16"></div>
                <div className="relative flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                    👤
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Customer Portal</h3>
                    <p className="text-xs text-gray-500">Shop Medicines</p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Browse, search, and purchase medicines with ease and convenience.
                </p>
                <div className="flex items-center text-green-600 font-medium group-hover:gap-2 transition-all">
                  Start Shopping
                  <svg className="w-5 h-5 ml-1 group-hover:ml-2 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Final Decorative Divider */}
        <div className="flex items-center justify-center mb-12">
          <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-md"></div>
          <div className="mx-4 text-orange-400">✧</div>
          <div className="h-px bg-gradient-to-r from-transparent via-orange-300 to-transparent w-full max-w-md"></div>
        </div>

        {/* CTA Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-purple-700 rounded-2xl p-12 text-center text-white shadow-2xl">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-32 -mt-32"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mb-32"></div>
          <div className="relative">
            <h2 className="text-3xl font-bold mb-3">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-95">
              Join thousands of satisfied customers who trust MediMitra for their healthcare needs
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-purple-600 hover:bg-gray-50 px-10 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Create Account Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
