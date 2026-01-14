import { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function StoreLocator() {
  const [selectedCity, setSelectedCity] = useState('All');
  const [clickedLocation, setClickedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  
  // Store locations in Uttarakhand (Haldwani, Bhimtal, Nainital)
  const stores = [
    {
      id: 1,
      name: 'MediPlus Pharmacy',
      city: 'Haldwani',
      address: 'Mall Road, Haldwani, Uttarakhand - 263139',
      phone: '+91-9876543210',
      position: [29.2183, 79.5130],
      timings: '8:00 AM - 10:00 PM',
      medicines: 450,
      color: 'primary'
    },
    {
      id: 2,
      name: 'HealthCare Store',
      city: 'Haldwani',
      address: 'Bhotia Parao, Haldwani, Uttarakhand - 263139',
      phone: '+91-9876543211',
      position: [29.2250, 79.5200],
      timings: '7:00 AM - 11:00 PM',
      medicines: 380,
      color: 'secondary'
    },
    {
      id: 3,
      name: 'WellCare Pharmacy',
      city: 'Nainital',
      address: 'Mall Road, Nainital, Uttarakhand - 263001',
      phone: '+91-9876543212',
      position: [29.3919, 79.4542],
      timings: '9:00 AM - 9:00 PM',
      medicines: 520,
      color: 'accent'
    },
    {
      id: 4,
      name: 'CureCare Medicals',
      city: 'Nainital',
      address: 'Tallital, Nainital, Uttarakhand - 263002',
      phone: '+91-9876543213',
      position: [29.3803, 79.4636],
      timings: '8:00 AM - 10:00 PM',
      medicines: 400,
      color: 'primary'
    },
    {
      id: 5,
      name: 'Bhimtal Medical Store',
      city: 'Bhimtal',
      address: 'Main Market, Bhimtal, Uttarakhand - 263136',
      phone: '+91-9876543214',
      position: [29.3488, 79.5595],
      timings: '8:00 AM - 9:00 PM',
      medicines: 320,
      color: 'secondary'
    },
    {
      id: 6,
      name: 'Lakeside Pharmacy',
      city: 'Bhimtal',
      address: 'Near Bhimtal Lake, Bhimtal, Uttarakhand - 263136',
      phone: '+91-9876543215',
      position: [29.3520, 79.5640],
      timings: '7:30 AM - 10:00 PM',
      medicines: 280,
      color: 'accent'
    }
  ];

  const cities = ['All', 'Haldwani', 'Nainital', 'Bhimtal'];
  
  const filteredStores = selectedCity === 'All' 
    ? stores 
    : stores.filter(store => store.city === selectedCity);

  // Center map on Uttarakhand region
  const mapCenter = [29.3, 79.5];
  const mapZoom = 10;

  // Fetch search suggestions as user types
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

  // Handle map click
  const handleMapClick = async (latlng) => {
    try {
      // Fetch location details using reverse geocoding (Nominatim API)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&accept-language=en`
      );
      const data = await response.json();
      
      setClickedLocation({
        position: [latlng.lat, latlng.lng],
        address: data.display_name || 'Address not available',
        name: data.name || 'Unknown Location',
        shouldOpenPopup: true
      });
    } catch (error) {
      console.error('Error fetching location details:', error);
      setClickedLocation({
        position: [latlng.lat, latlng.lng],
        address: 'Unable to fetch address',
        name: 'Custom Location',
        shouldOpenPopup: true
      });
    }
  };

  // Handle search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      // Search using Nominatim API with English language
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&accept-language=en&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = data[0];
        const newPosition = [parseFloat(location.lat), parseFloat(location.lon)];
        
        // Update clicked location
        setClickedLocation({
          position: newPosition,
          address: location.display_name,
          name: location.name || searchQuery,
          shouldOpenPopup: true
        });

        // Pan map to the searched location
        if (mapRef.current) {
          mapRef.current.setView(newPosition, 13);
        }
        
        setShowSuggestions(false);
      } else {
        alert('Location not found. Please try a different search term.');
      }
    } catch (error) {
      console.error('Error searching location:', error);
      alert('Error searching location. Please try again.');
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    const newPosition = [parseFloat(suggestion.lat), parseFloat(suggestion.lon)];
    
    setClickedLocation({
      position: newPosition,
      address: suggestion.display_name,
      name: suggestion.name || suggestion.display_name.split(',')[0],
      shouldOpenPopup: true
    });

    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);

    // Pan map to the selected location
    if (mapRef.current) {
      mapRef.current.setView(newPosition, 13);
    }
  };

  const getColorClass = (color) => {
    const colors = {
      primary: 'from-primary-500 to-primary-600',
      secondary: 'from-secondary-500 to-secondary-600',
      accent: 'from-accent-500 to-accent-600'
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
        <h1 className="text-4xl font-bold mb-2">📍 Store Locator</h1>
        <p className="text-white text-opacity-90">Find MediMitra partner pharmacies near you in Uttarakhand</p>
      </div>

      {/* City Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Filter by City</h3>
        <div className="flex flex-wrap gap-3">
          {cities.map(city => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                selectedCity === city
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {city === 'All' ? '🗺️ All Locations' : `📍 ${city}`}
            </button>
          ))}
        </div>
        <p className="text-gray-600 mt-4">
          Showing <span className="font-bold text-primary-600">{filteredStores.length}</span> store(s)
        </p>
      </div>

      {/* Map Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Interactive Map</h3>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-4 relative z-[1000]">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder="Search for a location (e.g., Haldwani, India)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-all relative z-10"
              />
              <svg 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              
              {/* Search Suggestions Dropdown */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute z-[9999] w-full mt-2 bg-white rounded-xl shadow-2xl border-2 border-gray-200 max-h-60 overflow-y-auto">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-all border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{suggestion.name || suggestion.display_name.split(',')[0]}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{suggestion.display_name}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
            >
              Search
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-600 mb-4">
          💡 Click anywhere on the map to view location details
        </p>

        <div className="rounded-2xl overflow-hidden shadow-lg relative z-0" style={{ height: '500px' }}>
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%', position: 'relative', zIndex: 0 }}
            scrollWheelZoom={true}
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapClickHandler onMapClick={handleMapClick} />
            
            {/* Store markers */}
            {filteredStores.map((store) => (
              <Marker key={store.id} position={store.position}>
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{store.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">📍 {store.address}</p>
                    <p className="text-sm text-gray-600 mb-1">📞 {store.phone}</p>
                    <p className="text-sm text-gray-600 mb-1">🕐 {store.timings}</p>
                    <p className="text-sm font-semibold text-primary-600">💊 {store.medicines} medicines available</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Clicked location marker */}
            {clickedLocation && (
              <Marker 
                position={clickedLocation.position}
                ref={markerRef}
                eventHandlers={{
                  add: (e) => {
                    // Automatically open popup when marker is added
                    if (clickedLocation.shouldOpenPopup) {
                      setTimeout(() => {
                        e.target.openPopup();
                      }, 100);
                    }
                  }
                }}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-lg text-blue-600 mb-2">📍 {clickedLocation.name}</h3>
                    <p className="text-sm text-gray-600">{clickedLocation.address}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Coordinates: {clickedLocation.position[0].toFixed(4)}, {clickedLocation.position[1].toFixed(4)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>

      {/* Store List */}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-6">All Stores</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map((store) => (
            <div key={store.id} className="medicine-card">
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${getColorClass(store.color)} p-6 text-white`}>
                <div className="flex justify-between items-start mb-3">
                  <span className={`badge ${getBadgeColor(store.color)} bg-white bg-opacity-90`}>
                    {store.city}
                  </span>
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold">{store.name}</h3>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="space-y-3 mb-4">
                  <div className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{store.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{store.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{store.timings}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span>{store.medicines} medicines available</span>
                  </div>
                </div>

                <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  Get Directions
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">About Our Locations</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Verified Pharmacies</h4>
              <p className="text-sm text-gray-600">All stores are licensed and verified for quality medicines</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-secondary-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Extended Hours</h4>
              <p className="text-sm text-gray-600">Many stores open from early morning to late night</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Expert Assistance</h4>
              <p className="text-sm text-gray-600">Professional pharmacists available for consultation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreLocator;
