import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Fix for default marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition, setAddress }) {
  useMapEvents({
    click: async (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      
      // Reverse geocoding to get address
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}&accept-language=en`
        );
        const data = await response.json();
        setAddress(data.display_name || '');
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    },
  });

  return position ? <Marker position={position} /> : null;
}

function AddStore({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    timings: '9:00 AM - 9:00 PM',
    latitude: 29.3,
    longitude: 79.5,
    status: 'Active'
  });
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState([29.3, 79.5]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [useManualInput, setUseManualInput] = useState(false);
  const mapRef = useRef(null);

  // Fetch search suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 3) {
        setSearchSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&accept-language=en&limit=5`
        );
        const data = await response.json();
        setSearchSuggestions(data);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSuggestionClick = (suggestion) => {
    const newPosition = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];
    setPosition(newPosition);
    setFormData(prev => ({
      ...prev,
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      address: suggestion.display_name
    }));
    setSearchQuery('');
    setShowSuggestions(false);

    if (mapRef.current) {
      mapRef.current.setView(newPosition, 15);
    }
  };

  const handlePositionChange = (newPosition, address = '') => {
    setPosition(newPosition);
    setFormData(prev => ({
      ...prev,
      latitude: newPosition[0],
      longitude: newPosition[1],
      address: address || prev.address
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`${API_BASE_URL}/stores`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Store added successfully!');
      onClose();
    } catch (error) {
      console.error('Error adding store:', error);
      alert('Failed to add store. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-8 max-w-5xl w-full shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-bold gradient-text">🏪 Add New Store</h3>
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
            {/* Store Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Store Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., MediPlus Pharmacy"
                className="input"
                required
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Haldwani"
                className="input"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91-XXXXXXXXXX"
                className="input"
              />
            </div>

            {/* Timings */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Operating Hours
              </label>
              <input
                type="text"
                name="timings"
                value={formData.timings}
                onChange={handleChange}
                placeholder="e.g., 9:00 AM - 9:00 PM"
                className="input"
              />
            </div>

            {/* Location Selection Method Toggle */}
            <div className="md:col-span-2">
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUseManualInput(false)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    !useManualInput
                      ? 'bg-gradient-to-r from-secondary-600 to-secondary-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📍 Select from Map
                </button>
                <button
                  type="button"
                  onClick={() => setUseManualInput(true)}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    useManualInput
                      ? 'bg-gradient-to-r from-secondary-600 to-secondary-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⌨️ Type Manually
                </button>
              </div>
            </div>

            {/* Map or Manual Input */}
            {!useManualInput ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                
                {/* Search Bar */}
                <div className="mb-4 relative z-[1000]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="Search for a location..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-all relative z-10"
                  />
                  
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute z-[9999] w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 max-h-60 overflow-y-auto">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-all border-b border-gray-100 last:border-b-0"
                        >
                          <p className="text-sm font-semibold text-gray-800">{suggestion.name || suggestion.display_name.split(',')[0]}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{suggestion.display_name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  💡 Click on the map to select a location
                </p>
                
                <div className="rounded-2xl overflow-hidden border-2 border-gray-300 relative z-0" style={{ height: '400px' }}>
                  <MapContainer
                    center={position as [number, number]}
                    zoom={13}
                    style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}
                    ref={mapRef}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <LocationMarker
                      position={position}
                      setPosition={handlePositionChange}
                      setAddress={(addr) => setFormData(prev => ({ ...prev, address: addr }))}
                    />
                  </MapContainer>
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600 mb-1">Selected coordinates:</p>
                  <p className="font-mono text-sm text-gray-800">
                    {position[0].toFixed(6)}, {position[1].toFixed(6)}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Manual Latitude */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={(e) => {
                      handleChange(e);
                      setPosition([parseFloat(e.target.value) || 0, formData.longitude]);
                    }}
                    placeholder="e.g., 29.3919"
                    step="any"
                    className="input"
                    required
                  />
                </div>

                {/* Manual Longitude */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={(e) => {
                      handleChange(e);
                      setPosition([formData.latitude, parseFloat(e.target.value) || 0]);
                    }}
                    placeholder="e.g., 79.4542"
                    step="any"
                    className="input"
                    required
                  />
                </div>
              </>
            )}

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Address <span className="text-red-500">*</span>
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address of the store"
                className="input resize-none"
                rows={2}
                required
              />
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              type="submit" 
              className="btn btn-secondary flex-1 flex items-center justify-center gap-2"
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
                  <span>Add Store</span>
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

export default AddStore;
