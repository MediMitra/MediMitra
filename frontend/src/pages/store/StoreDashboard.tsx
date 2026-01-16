import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_BASE_URL = 'https://medimitra-backend-xws5.onrender.com/api';

interface Order {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: 'PENDING' | 'RECEIVED' | 'DELIVERED' | 'CANCELLED';
  address: {
    addressLine1: string;
    city: string;
    state: string;
    pincode: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  items: Array<{
    id: number;
    quantity: number;
    price: number;
    medicine: {
      name: string;
      manufacturer: string;
    };
  }>;
}

interface Medicine {
  id: number;
  name: string;
  description: string;
  price: number;
  manufacturer: string;
  category: string;
  stock: number;
  expiryDate: string;
}

function StoreDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'RECEIVED' | 'DELIVERED'>('ALL');
  const [loading, setLoading] = useState(false);
  const [editingStock, setEditingStock] = useState<{ [key: number]: number }>({});
  

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
      if (activeTab === 'inventory') {
        fetchMedicines();
      }
    }
  }, [user?.id, statusFilter, activeTab]);

  const fetchOrders = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const endpoint = statusFilter === 'ALL' 
        ? `${API_BASE_URL}/store/orders/${user.id}`
        : `${API_BASE_URL}/store/orders/${user.id}/status/${statusFilter}`;
      const response = await axios.get(endpoint);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const updateOrderStatus = async (orderId: number, newStatus: 'RECEIVED' | 'DELIVERED' | 'CANCELLED') => {
    if (!user?.id) return;
    try {
      console.log('Updating order:', orderId, 'to status:', newStatus, 'for store:', user.id);
      const response = await axios.put(`${API_BASE_URL}/store/orders/${orderId}/status?storeId=${user.id}&status=${newStatus}`);
      console.log('Update successful:', response.data);
      fetchOrders();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      console.error('Error response:', error.response?.data);
      alert('Failed to update order status: ' + (error.response?.data?.message || error.message));
    }
  };

  const updateMedicineStock = async (medicineId: number, newStock: number) => {
    try {
      await axios.put(`${API_BASE_URL}/medicines/${medicineId}/stock?stock=${newStock}`);
      fetchMedicines();
      setEditingStock(prev => {
        const updated = { ...prev };
        delete updated[medicineId];
        return updated;
      });
    } catch (error) {
      console.error('Error updating medicine stock:', error);
      alert('Failed to update stock');
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order record? This action cannot be undone.')) return;
    if (!user?.id) return;
    try {
      await axios.delete(`${API_BASE_URL}/store/orders/${orderId}?storeId=${user.id}`);
      alert('Order record deleted successfully');
      fetchOrders();
    } catch (error: any) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'PENDING': return 'badge-orange';
      case 'RECEIVED': return 'badge-blue';
      case 'DELIVERED': return 'badge-green';
      case 'CANCELLED': return 'badge-red';
      default: return 'badge-gray';
    }
  };


  const renderOrdersTab = () => (
    <div>
      {/* Status Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-2 md:gap-3 mb-6 md:mb-8 flex-wrap"
      >
        {['ALL', 'PENDING', 'RECEIVED', 'DELIVERED', 'CANCELLED'].map((status, index) => (
          <motion.button
            key={status}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStatusFilter(status as any)}
            className={`px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-xl text-sm md:text-base font-bold transition-all shadow-md ${
              statusFilter === status
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            {status}
          </motion.button>
        ))}
      </motion.div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-teal-600"></div>
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p className="text-gray-500 text-xl font-semibold">No {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} orders found</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 px-4 sm:px-6 md:px-8 py-4 md:py-6 border-b-2 border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Order #{order.id}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg ${getStatusBadgeClass(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <div className="px-4 sm:px-6 md:px-8 py-4 md:py-6 space-y-4 md:space-y-5">
                {/* Customer Info */}
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 md:p-5 border-2 border-blue-100">
                  <div className="flex items-center gap-2 md:gap-3 mb-3">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 text-base md:text-lg">Customer Details</h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">Name:</span>
                      <span className="font-bold text-gray-900 break-words">{order.user.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 font-medium">Email:</span>
                      <span className="font-bold text-gray-900 break-all">{order.user.email}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">Shipping Address</h4>
                  </div>
                  <p className="text-sm text-gray-700 font-medium leading-relaxed">
                    {order.address.addressLine1}<br />
                    {order.address.city}, {order.address.state} - {order.address.pincode}
                  </p>
                </div>

                {/* Order Items */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">Order Items ({order.items.length})</h4>
                  </div>
                  <div className="space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center bg-gradient-to-r from-orange-50 to-amber-50 p-4 rounded-xl border-2 border-orange-100">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{item.medicine.name}</p>
                            <p className="text-sm text-gray-600 font-medium">{item.medicine.manufacturer}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900 text-lg">₹{item.price} × {item.quantity}</p>
                          <p className="text-sm text-teal-600 font-bold">= ₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total and Actions */}
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-4 sm:px-6 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 md:w-8 md:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Amount</p>
                    <p className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 md:gap-3 w-full sm:w-auto">
                  {order.status === 'PENDING' && (
                    <>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateOrderStatus(order.id, 'RECEIVED')}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all font-bold shadow-lg text-sm sm:text-base"
                      >
                        ✓ Mark as Received
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                        className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-bold shadow-lg text-sm sm:text-base"
                      >
                        ✕ Cancel Order
                      </motion.button>
                    </>
                  )}
                  {order.status === 'RECEIVED' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all font-bold shadow-lg text-sm sm:text-base"
                    >
                      ✓ Mark as Delivered
                    </motion.button>
                  )}
                  {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteOrder(order.id)}
                      className="flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-bold shadow-lg text-sm sm:text-base"
                    >
                      🗑 Delete Record
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInventoryTab = () => (
    <div>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-teal-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine, index) => (
            <motion.div
              key={medicine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{medicine.name}</h3>
                    <p className="text-sm text-gray-600 font-medium">{medicine.manufacturer}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-5">
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl">
                  <span className="text-gray-700 font-semibold">Stock:</span>
                  <span className={`px-4 py-2 rounded-lg font-bold shadow-md ${
                    medicine.stock > 50 ? 'bg-green-500 text-white' : 
                    medicine.stock > 0 ? 'bg-orange-500 text-white' : 
                    'bg-red-500 text-white'
                  }`}>
                    {medicine.stock} units
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-xl">
                  <span className="text-gray-700 font-semibold">Category:</span>
                  <span className="font-bold text-purple-700">{medicine.category}</span>
                </div>
                <div className="flex items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl">
                  <span className="text-gray-700 font-semibold">Price:</span>
                  <span className="font-bold text-green-600 text-xl">₹{medicine.price}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <input
                  type="number"
                  value={editingStock[medicine.id] ?? medicine.stock}
                  onChange={(e) => setEditingStock({ ...editingStock, [medicine.id]: parseInt(e.target.value) || 0 })}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 font-semibold text-gray-900"
                  min="0"
                  placeholder="Enter stock quantity"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => updateMedicineStock(medicine.id, editingStock[medicine.id] ?? medicine.stock)}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl hover:from-teal-700 hover:to-cyan-700 transition-all font-bold shadow-lg whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={editingStock[medicine.id] === undefined}
                >
                  ✓ Update Stock
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 rounded-3xl p-12 mb-8 text-white shadow-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2">Pharmacy Dashboard</h1>
                <p className="text-white text-opacity-95 text-sm sm:text-base md:text-lg">Welcome, <span className="font-semibold">{user?.name}</span>! Manage orders and inventory.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl p-2 mb-6 md:mb-8 border border-gray-100"
        >
          <div className="flex gap-2 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-3 md:py-4 px-3 sm:px-6 md:px-8 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all flex items-center justify-center gap-2 md:gap-3 ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="hidden sm:inline">Orders Management</span>
              <span className="sm:hidden">Orders</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab('inventory')}
              className={`flex-1 py-3 md:py-4 px-3 sm:px-6 md:px-8 rounded-xl font-bold text-sm sm:text-base md:text-lg transition-all flex items-center justify-center gap-2 md:gap-3 ${
                activeTab === 'inventory'
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="hidden sm:inline">Inventory Management</span>
              <span className="sm:hidden">Inventory</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'orders' ? renderOrdersTab() : renderInventoryTab()}
      </div>
    </div>
  );
}

export default StoreDashboard;
