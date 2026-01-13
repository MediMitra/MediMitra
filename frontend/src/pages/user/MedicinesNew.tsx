import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { medicineAPI, cartAPI } from '../../api/api';

function Medicines() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMedicines();
    fetchCartCount();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await medicineAPI.getAll();
      const medicinesData = response.data.map(med => ({
        id: med.id,
        name: med.name,
        category: med.category,
        price: med.price,
        description: med.description,
        manufacturer: med.manufacturer,
        stock: med.stock || 0,
        inStock: (med.stock || 0) > 0,
        rating: 4.5, // Default rating
        color: getCategoryColor(med.category)
      }));
      setMedicines(medicinesData);
    } catch (err) {
      console.error('Error fetching medicines:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await cartAPI.getCart();
      setCartCount(response.items?.length || 0);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'Pain Relief': 'primary',
      'Antibiotic': 'secondary',
      'Allergy': 'accent',
      'Digestive': 'primary',
      'Diabetes': 'secondary',
      'Supplements': 'accent'
    };
    return colorMap[category] || 'primary';
  };

  const categories = ['All', ...new Set(medicines.map(m => m.category))];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = async (medicine) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to add items to cart');
        navigate('/login');
        return;
      }

      await cartAPI.addToCart(medicine.id, 1);
      setCartCount(prev => prev + 1);
      
      // Show notification
      setShowCartNotification(true);
      setTimeout(() => setShowCartNotification(false), 2000);
    } catch (err) {
      console.error('Error adding to cart:', err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        alert('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        alert('Failed to add item to cart: ' + (err.response?.data?.message || err.message || 'Please try again'));
      }
    }
  };

  const getColorClasses = (color) => {
    const colors = {
      primary: 'from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700',
      secondary: 'from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700',
      accent: 'from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700'
    };
    return colors[color] || colors.primary;
  };

  const getBadgeColor = (color) => {
    const colors = {
      primary: 'badge-green',
      secondary: 'badge-blue',
      accent: 'badge-orange'
    };
    return colors[color] || 'badge-green';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">💊 Browse Medicines</h1>
        <p className="text-white text-opacity-90">Find the medicines you need with ease</p>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="animate-spin w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medicines...</p>
        </div>
      ) : (
        <>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search medicines by name or category..."
              className="input pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select 
            className="input"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600 text-lg">
          Found <span className="font-bold text-primary-600">{filteredMedicines.length}</span> medicine(s)
        </p>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMedicines.map((medicine) => (
          <div key={medicine.id} className="medicine-card">
            {/* Card Header with Gradient */}
            <div className={`bg-gradient-to-r ${getColorClasses(medicine.color)} p-6 text-white`}>
              <div className="flex justify-between items-start mb-4">
                <span className={`badge ${getBadgeColor(medicine.color)} bg-white bg-opacity-90`}>
                  {medicine.category}
                </span>
                <div className="flex gap-2">
                  {medicine.stock > 0 ? (
                    <span className="badge bg-green-500 text-white font-semibold">
                      ✓ {medicine.stock} In Stock
                    </span>
                  ) : (
                    <span className="badge bg-red-500 text-white font-semibold">Out of Stock</span>
                  )}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-2">{medicine.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(medicine.rating) ? 'text-yellow-300' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm">{medicine.rating}</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">{medicine.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium">{medicine.manufacturer}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="text-3xl font-bold text-primary-600">₹{medicine.price}</p>
                </div>
                <button
                  onClick={() => addToCart(medicine)}
                  disabled={!medicine.inStock}
                  className={`btn ${medicine.inStock ? 'btn-primary' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} flex items-center gap-2`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {medicine.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMedicines.length === 0 && (
        <div className="text-center py-16">
          <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-bold text-gray-700 mb-2">No medicines found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Cart Summary */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-2xl shadow-2xl p-4 min-w-64">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-lg">Cart ({cartCount})</h3>
            <span className="text-2xl font-bold">View</span>
          </div>
          <button 
            onClick={() => navigate('/cart')}
            className="btn bg-white text-primary-600 hover:bg-gray-100 w-full flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            View Cart
          </button>
        </div>
      )}
        </>
      )}

      {/* Add to Cart Notification */}
      {showCartNotification && (
        <div className="fixed top-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in z-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">Added to cart!</span>
        </div>
      )}
    </div>
  );
}

export default Medicines;
