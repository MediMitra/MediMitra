import { cartAPI, Medicine } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface MedicineCardProps {
  medicine: Medicine & {
    manufacturer?: string;
    stock?: number;
    requiresPrescription?: boolean;
  };
  onAddToCart?: () => void;
  index?: number;
}

const MedicineCard = ({ medicine, onAddToCart, index = 0 }: MedicineCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      await cartAPI.addToCart(medicine.id, 1);
      if (onAddToCart) onAddToCart();
      alert('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart');
    }
  };

  const isOutOfStock = !medicine.stock || medicine.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
        {medicine.imageUrl ? (
          <img 
            src={medicine.imageUrl} 
            alt={medicine.name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-56 flex items-center justify-center">
            <svg className="w-20 h-20 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {medicine.requiresPrescription && (
            <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              Rx Required
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              Out of Stock
            </span>
          )}
          {!isOutOfStock && medicine.stock && medicine.stock < 10 && (
            <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
              Low Stock
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-heading font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {medicine.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
          {medicine.description}
        </p>
        
        {medicine.manufacturer && (
          <p className="text-sm text-gray-500 mb-3 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>{medicine.manufacturer}</span>
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-primary-600">
              ₹{medicine.price.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              Stock: {medicine.stock || 0} units
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isOutOfStock 
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
              : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-700 hover:to-primary-600 hover:shadow-lg transform hover:scale-105'
          }`}
        >
          {isOutOfStock ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Out of Stock
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default MedicineCard;
