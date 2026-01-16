import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ReactNode } from 'react';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  link?: string;
  linkText?: string;
  delay?: number;
}

const ServiceCard = ({ icon, title, description, link, linkText = 'Learn More', delay = 0 }: ServiceCardProps) => {
  const CardContent = () => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group h-full"
    >
      <div className="flex flex-col h-full">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
          <div className="text-white">
            {icon}
          </div>
        </div>
        
        <h3 className="text-xl font-heading font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
          {description}
        </p>
        
        {link && (
          <div className="flex items-center text-primary-600 font-semibold group-hover:gap-2 transition-all">
            <span>{linkText}</span>
            <svg 
              className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (link) {
    return (
      <Link to={link} className="block h-full">
        <CardContent />
      </Link>
    );
  }

  return <CardContent />;
};

export default ServiceCard;
