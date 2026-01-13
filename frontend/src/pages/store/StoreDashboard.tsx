import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function StoreDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inventory');
  
  const [inventory, setInventory] = useState([
    { id: 1, name: 'Paracetamol 500mg', stock: 150, price: 50, category: 'Pain Relief', expiry: '2025-12-31', status: 'Available' },
    { id: 2, name: 'Amoxicillin 250mg', stock: 75, price: 120, category: 'Antibiotic', expiry: '2025-08-15', status: 'Available' },
    { id: 3, name: 'Cetirizine 10mg', stock: 200, price: 80, category: 'Allergy', expiry: '2026-03-20', status: 'Available' },
    { id: 4, name: 'Omeprazole 20mg', stock: 30, price: 150, category: 'Digestive', expiry: '2025-06-30', status: 'Low Stock' },
    { id: 5, name: 'Aspirin 75mg', stock: 180, price: 40, category: 'Pain Relief', expiry: '2025-11-10', status: 'Available' },
  ]);

  const [customers, setCustomers] = useState([
    { id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '+91-9876543210', totalOrders: 15, lastVisit: '2024-12-20' },
    { id: 2, name: 'Priya Sharma', email: 'priya@email.com', phone: '+91-9876543211', totalOrders: 8, lastVisit: '2024-12-21' },
    { id: 3, name: 'Amit Patel', email: 'amit@email.com', phone: '+91-9876543212', totalOrders: 22, lastVisit: '2024-12-22' },
    { id: 4, name: 'Neha Gupta', email: 'neha@email.com', phone: '+91-9876543213', totalOrders: 12, lastVisit: '2024-12-19' },
  ]);

  const [orders, setOrders] = useState([
    { id: 1001, customerName: 'Rajesh Kumar', items: 3, total: 450, status: 'Delivered', date: '2024-12-20' },
    { id: 1002, customerName: 'Priya Sharma', items: 2, total: 280, status: 'Processing', date: '2024-12-21' },
    { id: 1003, customerName: 'Amit Patel', items: 5, total: 680, status: 'Delivered', date: '2024-12-22' },
    { id: 1004, customerName: 'Neha Gupta', items: 1, total: 150, status: 'Pending', date: '2024-12-22' },
  ]);

  const [showUpdateStock, setShowUpdateStock] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [newStock, setNewStock] = useState('');

  const handleUpdateStock = (e) => {
    e.preventDefault();
    setInventory(inventory.map(item => 
      item.id === selectedMedicine.id 
        ? { ...item, stock: parseInt(newStock), status: parseInt(newStock) > 50 ? 'Available' : 'Low Stock' }
        : item
    ));
    setShowUpdateStock(false);
    setNewStock('');
  };

  const openUpdateStock = (medicine) => {
    setSelectedMedicine(medicine);
    setNewStock(medicine.stock.toString());
    setShowUpdateStock(true);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary-600 to-accent-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Store Dashboard</h1>
        <p className="text-secondary-100">{user?.name} - Managing your pharmacy efficiently</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Inventory</p>
              <p className="text-4xl font-bold mt-2">{inventory.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 text-sm font-medium">Total Customers</p>
              <p className="text-4xl font-bold mt-2">{customers.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm font-medium">Today's Orders</p>
              <p className="text-4xl font-bold mt-2">{orders.filter(o => o.date === '2024-12-22').length}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm font-medium">Low Stock Items</p>
              <p className="text-4xl font-bold mt-2">{inventory.filter(i => i.status === 'Low Stock').length}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'inventory'
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📦 Inventory
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'customers'
                ? 'bg-gradient-to-r from-secondary-600 to-secondary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            👥 Customers
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-accent-600 to-accent-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🛍️ Orders
          </button>
        </div>
      </div>

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Medicine Inventory</h2>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search medicines..."
                className="input w-64"
              />
            </div>
          </div>

          {/* Update Stock Modal */}
          {showUpdateStock && selectedMedicine && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 gradient-text">Update Stock</h3>
                <p className="text-gray-600 mb-4">Medicine: <span className="font-semibold">{selectedMedicine.name}</span></p>
                <form onSubmit={handleUpdateStock}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Stock: {selectedMedicine.stock}</label>
                      <input
                        type="number"
                        placeholder="New Stock Quantity"
                        className="input"
                        value={newStock}
                        onChange={(e) => setNewStock(e.target.value)}
                        required
                        min="0"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button type="submit" className="btn btn-primary flex-1">Update Stock</button>
                    <button
                      type="button"
                      onClick={() => setShowUpdateStock(false)}
                      className="btn btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {inventory.map((item) => (
              <div key={item.id} className="card hover:border-primary-300 border-2 border-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                      <span className={`badge ${item.status === 'Available' ? 'badge-green' : 'badge-orange'}`}>
                        {item.status}
                      </span>
                      <span className="badge badge-blue">{item.category}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Stock:</span>
                        <span className="ml-2 font-bold text-primary-700">{item.stock} units</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <span className="ml-2 font-semibold text-secondary-700">₹{item.price}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Expiry:</span>
                        <span className="ml-2 font-semibold">{item.expiry}</span>
                      </div>
                      <div>
                        <button
                          onClick={() => openUpdateStock(item)}
                          className="btn btn-primary text-sm py-2 px-4"
                        >
                          Update Stock
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customers Tab */}
      {activeTab === 'customers' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Customer Database</h2>
            <input
              type="text"
              placeholder="Search customers..."
              className="input w-64"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {customers.map((customer) => (
              <div key={customer.id} className="card hover:border-secondary-300 border-2 border-transparent">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{customer.name}</h3>
                      <span className="badge badge-blue">{customer.totalOrders} orders</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Last visit: {customer.lastVisit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Orders</h2>
            <select className="input w-48">
              <option>All Orders</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Delivered</option>
            </select>
          </div>

          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order.id} className="card hover:border-accent-300 border-2 border-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-800">Order #{order.id}</h3>
                      <span className={`badge ${
                        order.status === 'Delivered' ? 'badge-green' : 
                        order.status === 'Processing' ? 'badge-blue' : 
                        'badge-orange'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Customer:</span>
                        <span className="ml-2 font-semibold">{order.customerName}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Items:</span>
                        <span className="ml-2 font-semibold">{order.items}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Total:</span>
                        <span className="ml-2 font-bold text-accent-700">₹{order.total}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <span className="ml-2 font-semibold">{order.date}</span>
                      </div>
                    </div>
                  </div>
                  <button className="ml-4 btn btn-accent text-sm py-2 px-4">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default StoreDashboard;
