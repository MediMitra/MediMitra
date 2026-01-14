import { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const MEDICINE_TYPES = [
  'Pain Relief',
  'Antibiotic',
  'Allergy',
  'Digestive',
  'Cardiac',
  'Diabetes',
  'Respiratory',
  'Anti-inflammatory',
  'Vitamins & Supplements',
  'Antacid',
  'Other'
];

function AddMedicine({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    salt: '',
    type: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    manufacturer: '',
    prescriptionRequired: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_BASE_URL}/medicines`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Medicine added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Failed to add medicine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-8 max-w-3xl w-full shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold gradient-text">💊 Add New Medicine</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Medicine Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Medicine Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Azicip-500"
                className="input"
                required
              />
            </div>

            {/* Salt Composition */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Salt / Active Ingredient <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="salt"
                value={formData.salt}
                onChange={handleChange}
                placeholder="e.g., Azithromycin"
                className="input"
                required
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Type</option>
                {MEDICINE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Tablets, Capsules, Syrup"
                className="input"
              />
            </div>

            {/* Manufacturer */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Manufacturer
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                placeholder="e.g., PharmaCo"
                className="input"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Price (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
                className="input"
                required
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className="input"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the medicine..."
                className="input resize-none"
                rows={3}
              />
            </div>

            {/* Prescription Required */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="prescriptionRequired"
                  checked={formData.prescriptionRequired}
                  onChange={handleChange}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-semibold text-gray-700">
                  Prescription Required
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              type="submit" 
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Medicine</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMedicine;
