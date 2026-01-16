import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressAPI, orderAPI, storeAPI } from '../../api/api';
import { motion } from 'framer-motion';

const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      const response = await storeAPI.getAll();
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await addressAPI.getUserAddresses();
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddress(response.data[0].id.toString());
      }
    } catch (error) {
      console.error('Error fetching addresses from API, using localStorage:', error);
      const savedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
      setAddresses(savedAddresses);
      if (savedAddresses.length > 0) {
        setSelectedAddress(savedAddresses[0].id.toString());
      }
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addressAPI.createAddress(newAddress);
      alert('Address added successfully!');
      setShowAddressForm(false);
      setNewAddress({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      });
      fetchAddresses();
    } catch (error) {
      console.error('Error adding address to API, using localStorage:', error);
      const savedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
      const addressWithId = {
        ...newAddress,
        id: Date.now()
      };
      const updatedAddresses = [...savedAddresses, addressWithId];
      localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
      
      setAddresses(updatedAddresses);
      setSelectedAddress(addressWithId.id.toString());
      alert('Address added successfully!');
      setShowAddressForm(false);
      setNewAddress({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India'
      });
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      alert('Please select a delivery address');
      return;
    }

    try {
      const checkoutData: any = {
        addressId: parseInt(selectedAddress),
        paymentMethod
      };
      
      if (selectedStore) {
        checkoutData.storeId = parseInt(selectedStore);
      }
      
      const response = await orderAPI.checkout(checkoutData);
      localStorage.removeItem('cart');
      alert(`Order placed successfully! Order ID: #${response.data.id}`);
      navigate('/orders');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-green-600/80"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-white font-semibold">Secure Checkout</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">Complete Your Order</h1>
            <p className="text-xl text-green-100">Just a few steps to get your medicines delivered</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {/* Delivery Address Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
            </div>
            
            {addresses.length === 0 && !showAddressForm ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <p className="text-gray-600 mb-4">No saved addresses. Please add one to continue.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {addresses.map((address) => (
                  <label key={address.id} className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedAddress === address.id.toString()
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                  }`}>
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddress === address.id.toString()}
                      onChange={(e) => setSelectedAddress(e.target.value)}
                      className="mt-1 mr-4 w-5 h-5 text-green-600"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">{address.fullName || 'Address'}</p>
                      <p className="text-gray-600">{address.street || address.addressLine1}</p>
                      <p className="text-gray-600">{address.city}, {address.state} - {address.zipCode || address.postalCode}</p>
                      {address.phone && (
                        <p className="text-gray-600 mt-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {address.phone}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            )}
            
            {!showAddressForm ? (
              <button 
                onClick={() => setShowAddressForm(true)}
                className="flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-xl font-bold hover:bg-green-200 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Address
              </button>
            ) : (
              <form onSubmit={handleAddAddress} className="space-y-4 bg-gray-50 p-6 rounded-xl">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Street Address *"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={newAddress.addressLine1}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  value={newAddress.addressLine2}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                />
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="City *"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="State *"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="ZIP Code *"
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    value={newAddress.zipCode}
                    onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all shadow-lg">
                    Save Address
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setShowAddressForm(false)}
                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </motion.div>
          
          {/* Store Selection Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Select Pharmacy Store</h2>
            </div>
            
            <p className="text-gray-600 mb-6 bg-blue-50 p-4 rounded-xl">
              Choose your preferred pharmacy store, or let us auto-assign the nearest one to your location.
            </p>
            
            <div className="space-y-3">
              <label className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedStore === ''
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="store"
                  value=""
                  checked={selectedStore === ''}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="mt-1 mr-4 w-5 h-5 text-blue-600"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    Auto-assign Nearest Store (Recommended)
                  </p>
                  <p className="text-gray-600">We'll automatically select the closest pharmacy to ensure fast delivery</p>
                </div>
              </label>
              
              {stores.map((store: any) => (
                <label key={store.id} className={`flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  selectedStore === store.id.toString()
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}>
                  <input
                    type="radio"
                    name="store"
                    value={store.id}
                    checked={selectedStore === store.id.toString()}
                    onChange={(e) => setSelectedStore(e.target.value)}
                    className="mt-1 mr-4 w-5 h-5 text-blue-600"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 mb-1">{store.name}</p>
                    <p className="text-gray-600">{store.address}</p>
                    <p className="text-gray-600">{store.city}, {store.state}</p>
                    {store.phone && (
                      <p className="text-gray-500 mt-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {store.phone}
                      </p>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </motion.div>
          
          {/* Payment Method Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
            </div>
            
            <div className="space-y-3">
              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'COD'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4 w-5 h-5 text-purple-600"
                />
                <div className="flex items-center gap-3 flex-1">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div>
                    <p className="font-bold text-gray-900">Cash on Delivery</p>
                    <p className="text-sm text-gray-600">Pay when you receive your order</p>
                  </div>
                </div>
              </label>
              
              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'CARD'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="CARD"
                  checked={paymentMethod === 'CARD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4 w-5 h-5 text-purple-600"
                />
                <div className="flex items-center gap-3 flex-1">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div>
                    <p className="font-bold text-gray-900">Credit/Debit Card</p>
                    <p className="text-sm text-gray-600">Secure payment via card</p>
                  </div>
                </div>
              </label>
              
              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                paymentMethod === 'UPI'
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="payment"
                  value="UPI"
                  checked={paymentMethod === 'UPI'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-4 w-5 h-5 text-purple-600"
                />
                <div className="flex items-center gap-3 flex-1">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="font-bold text-gray-900">UPI Payment</p>
                    <p className="text-sm text-gray-600">Pay via UPI apps</p>
                  </div>
                </div>
              </label>
            </div>
          </motion.div>
          
          {/* Place Order Button */}
          <motion.button 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={handleCheckout}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-5 rounded-2xl font-bold text-xl hover:from-green-700 hover:to-green-800 transition-all shadow-2xl hover:shadow-3xl flex items-center justify-center gap-3"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Place Order Securely
          </motion.button>

          {/* Security Info */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Secure Checkout
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
              </svg>
              Fast Delivery
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
