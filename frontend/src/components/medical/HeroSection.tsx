import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  label?: string;
  backgroundImage?: string;
}

const HeroSection = ({
  title,
  subtitle,
  description,
  primaryButtonText,
  primaryButtonLink,
  secondaryButtonText,
  secondaryButtonLink,
  label,
  backgroundImage = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=800&fit=crop',
}: HeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-r from-primary-900 to-primary-700 overflow-hidden">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {label && (
              <motion.div 
                className="inline-block mb-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-medical-teal font-semibold text-sm tracking-wider uppercase">
                  {label}
                </span>
              </motion.div>
            )}
            
            {subtitle && (
              <motion.p 
                className="text-primary-200 text-sm font-medium mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {subtitle}
              </motion.p>
            )}
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {title}
            </motion.h1>
            
            <motion.p 
              className="text-lg text-primary-100 mb-8 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {description}
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to={primaryButtonLink}
                className="bg-medical-teal hover:bg-medical-green text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                {primaryButtonText}
              </Link>
              
              {secondaryButtonText && secondaryButtonLink && (
                <Link
                  to={secondaryButtonLink}
                  className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 px-8 py-4 rounded-lg font-semibold transition-all duration-300 backdrop-blur-sm"
                >
                  {secondaryButtonText}
                </Link>
              )}
            </motion.div>
          </motion.div>
          
          {/* Right side - Decorative elements or stats */}
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative">
              <motion.div
                className="absolute -top-10 -right-10 w-72 h-72 bg-medical-teal/20 rounded-full blur-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-medical-teal mb-2">24/7</div>
                    <div className="text-white text-sm">Service Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-medical-teal mb-2">100+</div>
                    <div className="text-white text-sm">Medicines</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-medical-teal mb-2">50+</div>
                    <div className="text-white text-sm">Partner Stores</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-medical-teal mb-2">1000+</div>
                    <div className="text-white text-sm">Happy Customers</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
          <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,106.7C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default HeroSection;
