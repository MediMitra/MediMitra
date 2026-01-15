import { useEffect, useMemo, useState } from 'react';
import { orderAPI } from '../../api/api';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await orderAPI.getUserOrders();
        setOrders(response.data || []);
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">📦 My Orders</h1>
        <p className="text-white text-opacity-90">Track and manage your medicine orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Orders</p>
              <p className="text-4xl font-bold mt-2">{totals.totalOrders}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 text-sm font-medium">Processing</p>
              <p className="text-4xl font-bold mt-2">{totals.processing}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm font-medium">Total Spent</p>
              <p className="text-4xl font-bold mt-2">₹{totals.totalSpent.toFixed(2)}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.map((order) => {
          const created = order.createdAt || order.date;
          const items = order.items || [];
          const address = order.address;
          const status = order.status;

          return (
          <div key={order.id} className="card">
            {/* Order Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-2 border-gray-100">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-gray-800">Order #{order.id}</h3>
                  <span className={`badge ${getStatusColor(order.status)}`}>
                    {(order.status || '').charAt(0) + (order.status || '').slice(1).toLowerCase()}
                  </span>
                </div>
                <p className="text-gray-600">Placed on {created ? new Date(created).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-3xl font-bold text-primary-600">₹{Number(order.totalAmount || order.total || 0).toFixed(2)}</p>
              </div>
            </div>

            {/* Order Items Preview */}
            <div className="py-6 border-b-2 border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-3">Items ({items.length})</h4>
              {expandedOrder === order.id ? (
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{item.name || item.medicine?.name || 'Item'}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-primary-600">₹{Number(item.price || item.medicine?.price || 0) * (item.quantity || 0)}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">
                  {items.slice(0, 2).map(item => item.name || item.medicine?.name).join(', ')}
                  {items.length > 2 && ` +${items.length - 2} more`}
                </p>
              )}
            </div>

            {/* Expanded Details */}
            {expandedOrder === order.id && (
              <div className="py-6 border-b-2 border-gray-100 space-y-4">
                {order.store && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">🏪 Store</h4>
                    <p className="text-gray-600">
                      <span className="font-medium">{order.store.name}</span>
                      {order.store.address && ` - ${order.store.address}`}
                      {order.store.phone && (
                        <span className="block text-sm text-gray-500 mt-1">
                          📞 {order.store.phone}
                        </span>
                      )}
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Delivery Address</h4>
                  <p className="text-gray-600">
                    {address
                      ? `${address.fullName}, ${address.addressLine1}${address.addressLine2 ? ', ' + address.addressLine2 : ''}, ${address.city}, ${address.state} - ${address.zipCode}`
                      : 'Address not available'}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Tracking Number</h4>
                  <p className="text-primary-600 font-mono">{order.trackingNumber || 'Not available'}</p>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold shadow-md flex items-center gap-2"
              >
                {expandedOrder === order.id ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Show Less
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    View Details
                  </>
                )}
              </button>
              {(status && (status.toUpperCase() === 'DELIVERED' || status.toUpperCase() === 'CANCELLED')) && (
                <button 
                  onClick={() => deleteOrder(order.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold shadow-md flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              )}
            </div>
          </div>
          );
        })}
      </div>

      {/* Empty State */}
      {!loading && orders.length === 0 && (
        <div className="card text-center py-16">
          <svg className="w-32 h-32 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="text-3xl font-bold gradient-text mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-6">Start shopping to see your orders here!</p>
          <a href="/medicines" className="btn btn-primary">
            Browse Medicines
          </a>
        </div>
      )}

      {/* Loading / Error States */}
      {loading && (
        <div className="card text-center py-10">
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      )}
      {error && (
        <div className="card text-center py-6 bg-red-50 text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}

export default Orders;
