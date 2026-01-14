import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

interface Medicine {
  id: number;
  name: string;
  description: string;
  price: number;
  manufacturer: string;
  category: string;
  stock: number;
  expiryDate: string;
  salt?: string;
  type?: string;
}

function BrowseMedicines() {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/medicines`);
      setMedicines(response.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(medicines.map(m => m.category).filter(Boolean))];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         medicine.manufacturer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      {/* Header */}
      <div className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <span className="text-3xl font-bold gradient-text">MediMitra</span>
            </div>
            <button onClick={() => navigate('/login-user')} className="btn btn-primary">
              Sign In to Purchase
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 rounded-3xl p-12 mb-8 text-white shadow-xl">
          <h1 className="text-5xl font-bold mb-4">Browse Our Medicines</h1>
          <p className="text-xl text-white text-opacity-90">Discover quality medicines at affordable prices. Sign in to add items to cart and make purchases.</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Medicines Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading medicines...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine) => (
              <div key={medicine.id} className="card hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{medicine.name}</h3>
                    {medicine.salt && (
                      <p className="text-sm text-blue-600 font-semibold">{medicine.salt}</p>
                    )}
                  </div>
                  <span className={`badge ${medicine.stock > 50 ? 'badge-green' : medicine.stock > 0 ? 'badge-orange' : 'badge-red'}`}>
                    {medicine.stock > 50 ? 'In Stock' : medicine.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                {medicine.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{medicine.description}</p>
                )}
                
                <div className="space-y-2 mb-4">
                  {medicine.type && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500">Type:</span>
                      <span className="font-semibold text-purple-700">{medicine.type}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Category:</span>
                    <span className="font-semibold text-secondary-700">{medicine.category || 'General'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Manufacturer:</span>
                    <span className="font-semibold text-gray-700">{medicine.manufacturer}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-2xl font-bold text-primary-600">₹{medicine.price}</span>
                  <button 
                    onClick={() => navigate('/login-user')}
                    className="btn btn-primary btn-sm"
                  >
                    Sign In to Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {!loading && filteredMedicines.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No medicines found</p>
            <p className="text-sm mt-2">Try adjusting your search or filter</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrowseMedicines;
