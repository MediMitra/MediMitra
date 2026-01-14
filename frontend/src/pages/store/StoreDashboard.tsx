import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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
      <div className="flex gap-4 mb-6 flex-wrap">
        {['ALL', 'PENDING', 'RECEIVED', 'DELIVERED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status as any)}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              statusFilter === status
                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600 mx-auto"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No {statusFilter !== 'ALL' ? statusFilter.toLowerCase() : ''} orders found</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="card hover:shadow-xl transition-shadow">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-200">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Customer Details</h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <span className="ml-2 font-semibold">{order.user.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2 font-semibold">{order.user.email}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-blue-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-gray-700 mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-700">
                  {order.address.addressLine1}<br />
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-700 mb-3">Items</h4>
                <div className="space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{item.medicine.name}</p>
                        <p className="text-sm text-gray-500">{item.medicine.manufacturer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">₹{item.price} × {item.quantity}</p>
                        <p className="text-sm text-gray-500">= ₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total and Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">₹{order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="flex gap-3">
                  {order.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'RECEIVED')}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all font-semibold shadow-md"
                      >
                        Mark as Received
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                        className="btn bg-red-600 hover:bg-red-700 text-white"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'RECEIVED' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all font-semibold shadow-md"
                    >
                      Mark as Delivered
                    </button>
                  )}
                  {(order.status === 'DELIVERED' || order.status === 'CANCELLED') && (
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold shadow-md"
                    >
                      Delete Record
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderInventoryTab = () => (
    <div>
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((medicine) => (
            <div key={medicine.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{medicine.name}</h3>
                  <p className="text-sm text-gray-500">{medicine.manufacturer}</p>
                </div>
                <span className={`badge ${medicine.stock > 50 ? 'badge-green' : medicine.stock > 0 ? 'badge-orange' : 'badge-red'}`}>
                  {medicine.stock} units
                </span>
              </div>
              
              <div className="space-y-2 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2 font-semibold">{medicine.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Price:</span>
                  <span className="ml-2 font-semibold text-primary-600">₹{medicine.price}</span>
                </div>
              </div>

              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  value={editingStock[medicine.id] ?? medicine.stock}
                  onChange={(e) => setEditingStock({ ...editingStock, [medicine.id]: parseInt(e.target.value) || 0 })}
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  min="0"
                />
                <button
                  onClick={() => updateMedicineStock(medicine.id, editingStock[medicine.id] ?? medicine.stock)}
                  className="btn btn-primary btn-sm"
                  disabled={editingStock[medicine.id] === undefined}
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-primary-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-2">Store Dashboard</h1>
          <p className="text-lg text-white text-opacity-90">Welcome, {user?.name}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Orders Management
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Inventory Management
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'orders' ? renderOrdersTab() : renderInventoryTab()}
      </div>
    </div>
  );
}

export default StoreDashboard;
