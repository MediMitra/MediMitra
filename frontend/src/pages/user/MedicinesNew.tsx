import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { medicineAPI, cartAPI } from '../../api/api';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

function Medicines() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchMedicines();
    if (user) {
      fetchCartCount();
    }
  }, [user]);

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
      if (!user) {
        alert('Please login to add items to cart');
        navigate('/login-selection');
        return;
      }

      console.log('Adding medicine to cart:', medicine.id);
      const response = await cartAPI.addToCart(medicine.id, 1);
      console.log('Add to cart response:', response);
      
      // Refresh cart count after adding
      const cartResponse = await cartAPI.getCart();
      const newCount = cartResponse.data?.items?.length || 0;
      setCartCount(newCount);
      console.log('Updated cart count:', newCount);
      
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-600/80"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span className="text-white font-semibold">Browse Our Medicines</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Your Health, Our Priority
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Discover quality medicines from trusted manufacturers with secure and fast delivery
            </p>
            
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 justify-center"
              >
                <Link
                  to="/login-selection"
                  className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-xl inline-flex items-center gap-2"
                >
                  Sign In to Order
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-medium">Loading medicines...</p>
          </div>
        </div>
      ) : (
        <>

      {/* Search and Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100"
      >
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search medicines by name or category..."
              className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </div>
            <select 
              className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg appearance-none bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-3">
          {categories.map(cat => (
            <motion.button
              key={cat}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Results Count */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">
          Available Medicines <span className="text-blue-600">({filteredMedicines.length})</span>
        </h2>
        <p className="text-gray-600 mt-2">Browse our collection of quality healthcare products</p>
      </div>

      {/* Medicine Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMedicines.map((medicine, index) => (
          <motion.div
            key={medicine.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide">
                  {medicine.category}
                </span>
                {medicine.stock > 0 ? (
                  <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {medicine.stock} In Stock
                  </span>
                ) : (
                  <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold">Out of Stock</span>
                )}
              </div>
              
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">{medicine.name}</h3>
              
              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(medicine.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-sm font-semibold text-gray-700">{medicine.rating}</span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6">
              <p className="text-gray-600 mb-4 text-sm leading-relaxed h-12 overflow-hidden">{medicine.description}</p>
              
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-6 bg-gray-50 p-3 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-semibold">{medicine.manufacturer}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Price</p>
                  <p className="text-3xl font-bold text-blue-600">₹{medicine.price}</p>
                </div>
                <button
                  onClick={() => addToCart(medicine)}
                  disabled={!medicine.inStock}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 ${
                    medicine.inStock
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {medicine.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMedicines.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-3">No Medicines Found</h3>
          <p className="text-gray-600 text-lg mb-6">Try adjusting your search or filter criteria</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
            }}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition-all inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset Filters
          </button>
        </div>
      )}

      {/* Cart Floating Button */}
      {user && cartCount > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <button
            onClick={() => navigate('/cart')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-2xl p-6 hover:shadow-3xl transition-all duration-300 min-w-64"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-90">Cart</p>
                  <p className="text-2xl font-bold">{cartCount} items</p>
                </div>
              </div>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
            <div className="text-center bg-white text-blue-600 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all">
              View Cart
            </div>
          </button>
        </motion.div>
      )}
        </>
      )}
      </div>

      {/* Add to Cart Notification */}
      {showCartNotification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-8 right-8 bg-green-500 text-white px-8 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50"
        >
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-bold text-lg">Added to cart successfully!</span>
        </motion.div>
      )}
    </div>
  );
}

export default Medicines;
