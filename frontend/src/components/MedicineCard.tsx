import { cartAPI, Medicine } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface MedicineCardProps {
  medicine: Medicine & {
    manufacturer?: string;
    stock?: number;
    requiresPrescription?: boolean;
  };
  onAddToCart?: () => void;
}

const MedicineCard = ({ medicine, onAddToCart }: MedicineCardProps) => {
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

  return (
    <div className="card hover:shadow-xl transition-shadow">
      <div className="mb-4">
        {medicine.imageUrl && (
          <img 
            src={medicine.imageUrl} 
            alt={medicine.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        )}
      </div>
      <h3 className="text-xl font-semibold mb-2">{medicine.name}</h3>
      <p className="text-gray-600 mb-2 text-sm line-clamp-2">{medicine.description}</p>
      <p className="text-sm text-gray-500 mb-2">Manufacturer: {medicine.manufacturer}</p>
      <div className="flex justify-between items-center mt-4">
        <span className="text-2xl font-bold text-primary-600">
          ₹{medicine.price}
        </span>
        <button 
          onClick={handleAddToCart}
          disabled={!medicine.stock || medicine.stock === 0}
          className={`btn ${medicine.stock && medicine.stock > 0 ? 'btn-primary' : 'bg-gray-400 text-white cursor-not-allowed'}`}
        >
          {medicine.stock && medicine.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
      {medicine.requiresPrescription && (
        <p className="text-xs text-red-600 mt-2">* Requires Prescription</p>
      )}
      <p className="text-xs text-gray-500 mt-1">Stock: {medicine.stock || 0}</p>
    </div>
  );
};

export default MedicineCard;
