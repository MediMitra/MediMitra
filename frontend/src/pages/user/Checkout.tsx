import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addressAPI, orderAPI } from '../../api/api';

const Checkout = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
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
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await addressAPI.getUserAddresses();
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddress(response.data[0].id.toString());
      }
    } catch (error) {
      console.error('Error fetching addresses from API, using localStorage:', error);
      // Fallback to localStorage
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
      // Fallback to localStorage
      const savedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
      const addressWithId = {
        ...newAddress,
        id: Date.now() // Generate unique ID
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
      const response = await orderAPI.checkout({
        addressId: parseInt(selectedAddress),
        paymentMethod
      });
      
      // Clear localStorage cart
      localStorage.removeItem('cart');
      
      // Show success message
      alert(`Order placed successfully! Order ID: #${response.data.id}`);
      
      // Navigate to orders page to see the new order
      navigate('/orders');
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      <div className="space-y-6">
        {/* Delivery Address Section */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Delivery Address</h2>
          
          {addresses.length === 0 && !showAddressForm ? (
            <p className="text-gray-600 mb-4">No addresses found. Please add one.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {addresses.map((address) => (
                <label key={address.id} className="flex items-start p-3 border rounded cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="address"
                    value={address.id}
                    checked={selectedAddress === address.id.toString()}
                    onChange={(e) => setSelectedAddress(e.target.value)}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <p className="font-medium">{address.fullName || 'Address'}</p>
                    <p className="text-sm text-gray-600">{address.street || address.addressLine1}</p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} - {address.zipCode || address.postalCode}
                    </p>
                    {address.phone && <p className="text-sm text-gray-600">Phone: {address.phone}</p>}
                  </div>
                </label>
              ))}
            </div>
          )}
          
          {!showAddressForm ? (
            <button 
              onClick={() => setShowAddressForm(true)}
              className="btn btn-secondary"
            >
              Add New Address
            </button>
          ) : (
            <form onSubmit={handleAddAddress} className="space-y-3">
              <input
                type="text"
                placeholder="Full Name"
                className="input"
                value={newAddress.fullName}
                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="input"
                value={newAddress.phone}
                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Street Address"
                className="input"
                value={newAddress.addressLine1}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Apartment, suite, etc. (optional)"
                className="input"
                value={newAddress.addressLine2}
                onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="City"
                  className="input"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="State"
                  className="input"
                  value={newAddress.state}
                  onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                  required
                />
              </div>
              <input
                type="text"
                placeholder="ZIP Code"
                className="input"
                value={newAddress.zipCode}
                onChange={(e) => setNewAddress({ ...newAddress, zipCode: e.target.value })}
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">Save Address</button>
                <button 
                  type="button" 
                  onClick={() => setShowAddressForm(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
        
        {/* Payment Method Section */}
        <div className="card">
          <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
          <div className="space-y-2">
            <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="CARD"
                checked={paymentMethod === 'CARD'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              Credit/Debit Card
            </label>
            <label className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="payment"
                value="UPI"
                checked={paymentMethod === 'UPI'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-3"
              />
              UPI
            </label>
          </div>
        </div>
        
        {/* Place Order Button */}
        <button 
          onClick={handleCheckout}
          className="w-full btn btn-primary text-lg py-3"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
