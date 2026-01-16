import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function LoginSelection(): JSX.Element {
  const portals = [
    {
      title: 'Patient Portal',
      description: 'Access your health records and book appointments',
      icon: '👤',
      link: '/login-user',
      gradient: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-200'
    },
    {
      title: 'Pharmacy Portal',
      description: 'Manage your pharmacy operations and inventory',
      icon: '🏪',
      link: '/login-store',
      gradient: 'from-medical-teal to-medical-green',
      shadow: 'shadow-teal-200'
    },
    {
      title: 'Admin Portal',
      description: 'Platform management and system administration',
      icon: '⚙️',
      link: '/login-admin',
      gradient: 'from-medical-red to-red-600',
      shadow: 'shadow-red-200'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Medical Background */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-primary-600/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Access Portal</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Choose your portal to access MediMitra's comprehensive healthcare platform
            </p>
          </motion.div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </div>

      {/* Portal Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal, index) => (
            <motion.div
              key={portal.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={portal.link}>
                <div className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl ${portal.shadow} transition-all duration-300 overflow-hidden`}>
                  <div className={`h-2 bg-gradient-to-r ${portal.gradient}`}></div>
                  <div className="p-8">
                    <div className={`w-16 h-16 bg-gradient-to-br ${portal.gradient} rounded-xl flex items-center justify-center mb-6 text-3xl group-hover:scale-110 transition-transform duration-300`}>
                      {portal.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{portal.title}</h3>
                    <p className="text-gray-600 mb-6">{portal.description}</p>
                    <div className="flex items-center text-primary-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                      Access Portal
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-2xl mx-auto">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h4>
            <p className="text-gray-600">If you're having trouble accessing your portal, please contact our support team at <a href="mailto:support@medimitra.com" className="text-primary-600 hover:text-primary-700 font-semibold">support@medimitra.com</a></p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">© 2026 MediMitra. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginSelection;
