import { useEffect, useMemo, useState } from 'react';
import { orderAPI } from '../../api/api';
import { motion } from 'framer-motion';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        console.log('Fetching orders...');
        const response = await orderAPI.getUserOrders();
        console.log('Orders response:', response);
        console.log('Orders data:', response.data);
        setOrders(response.data || []);
        console.log('Orders set:', response.data?.length || 0);
      } catch (err) {
        console.error('Failed to load orders', err);
        setError(err.response?.data?.message || 'Unable to load your orders.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const deleteOrder = async (orderId) => {
    if (!confirm('Are you sure you want to delete this order from your history?')) return;
    try {
      await orderAPI.deleteOrder(orderId);
      setOrders(orders.filter(o => o.id !== orderId));
      alert('Order deleted successfully');
    } catch (err) {
      console.error('Failed to delete order', err);
      alert('Failed to delete order: ' + (err.response?.data?.message || err.message));
    }
  };

  const totals = useMemo(() => {
    const totalOrders = orders.length;
    const processing = orders.filter((o) => (o.status || '').toUpperCase() === 'PROCESSING').length;
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    return { totalOrders, processing, totalSpent };
  }, [orders]);

  const getStatusColor = (status) => {
    const normalized = (status || '').toUpperCase();
    const colors = {
      DELIVERED: 'bg-primary-100 text-primary-800',
      PROCESSING: 'bg-secondary-100 text-secondary-800',
      PENDING: 'bg-accent-100 text-accent-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[normalized] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const normalized = (status || '').toUpperCase();
    switch (normalized) {
      case 'DELIVERED':
        return (
          <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'PROCESSING':
        return (
          <svg className="w-6 h-6 text-secondary-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-purple-600/80"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full mb-6">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span className="text-white font-semibold">Order History</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">My Orders</h1>
            <p className="text-xl text-purple-100">Track and manage all your medicine orders</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Total Orders</p>
              <p className="text-4xl font-bold text-purple-600">{totals.totalOrders}</p>
            </div>
            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Processing</p>
              <p className="text-4xl font-bold text-blue-600">{totals.processing}</p>
            </div>
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-2">Total Spent</p>
              <p className="text-4xl font-bold text-green-600">₹{totals.totalSpent.toFixed(2)}</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">No Orders Yet</h2>
          <p className="text-gray-600 mb-8 text-lg">Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => {
            const created = order.createdAt || order.date;
            const items = order.items || [];
            const address = order.address;
            const status = order.status;

            return (
              <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
          >
            {/* Order Header */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-8 py-6 border-b-2 border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-3 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Order ID</p>
                      <p className="text-xl font-bold text-gray-900">#{order.id}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-3 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Order Date</p>
                      <p className="text-lg font-semibold text-gray-900">{created ? new Date(created).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-3 rounded-xl shadow-lg">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold text-green-600">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={`px-6 py-3 rounded-xl font-semibold text-sm shadow-lg ${getStatusColor(order.status)} transition-all duration-300 hover:scale-105 flex items-center gap-2`}>
                {getStatusIcon(order.status)}
                {(order.status || '').charAt(0) + (order.status || '').slice(1).toLowerCase()}
              </div>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="px-8 py-6 border-b-2 border-gray-100">
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="w-full flex items-center justify-between text-left hover:bg-gray-50 rounded-xl p-4 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Order Items</h4>
                    <p className="text-sm text-gray-600">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
                  </div>
                </div>
                <svg 
                  className={`w-6 h-6 text-gray-400 transition-transform duration-300 ${expandedOrder === order.id ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {expandedOrder === order.id ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-3"
                >
                  {items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{item.name || item.medicine?.name || 'Item'}</p>
                          <p className="text-sm text-gray-600 font-medium">Quantity: <span className="text-blue-600">{item.quantity}</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 font-medium mb-1">Total</p>
                        <p className="font-bold text-2xl text-green-600">₹{Number(item.price || item.medicine?.price || 0) * (item.quantity || 0)}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : null}
              
              {!expandedOrder || expandedOrder !== order.id ? (
                <p className="text-gray-600 mt-3 px-4 py-3 bg-gray-50 rounded-xl">
                  <span className="font-semibold text-gray-800">Preview:</span> {items.slice(0, 2).map(item => item.name || item.medicine?.name).join(', ')}
                  {items.length > 2 && <span className="text-blue-600 font-semibold"> +{items.length - 2} more</span>}
                </p>
              ) : null}
            </div>

            {/* Expanded Details */}
            {expandedOrder === order.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-8 py-6 bg-gradient-to-r from-gray-50 to-blue-50 border-t-2 border-gray-100 space-y-5"
              >
                {order.store && (
                  <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <h4 className="font-bold text-gray-900 text-lg">Pharmacy Store</h4>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg mb-1">{order.store.name}</p>
                    {order.store.address && <p className="text-gray-600 mb-2">📍 {order.store.address}</p>}
                    {order.store.phone && <p className="text-gray-600">📞 {order.store.phone}</p>}
                  </div>
                )}
                
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">Delivery Address</h4>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {address
                      ? `${address.fullName}, ${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}, ${address.city}, ${address.state} - ${address.zipCode}`
                      : 'Address not available'}
                  </p>
                </div>
                
                <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-gray-900 text-lg">Tracking Number</h4>
                  </div>
                  <p className="text-purple-600 font-mono text-lg font-bold">{order.trackingNumber || 'Not available yet'}</p>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="px-8 py-5 bg-gray-50 flex flex-wrap gap-3">
              {(status && (status.toUpperCase() === 'DELIVERED' || status.toUpperCase() === 'CANCELLED')) && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deleteOrder(order.id)}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Order
                </motion.button>
              )}
            </div>
          </motion.div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

export default Orders;
