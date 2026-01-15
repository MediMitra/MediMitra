import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import AddMedicine from './AddMedicine';
import AddStore from './AddStore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL = 'https://medimitra-backend-xws5.onrender.com/api';

function AdminDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'analytics');
  const [dashboardStats, setDashboardStats] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [stores, setStores] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [showSetCredentials, setShowSetCredentials] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [revenueChartData, setRevenueChartData] = useState<any>(null);
  const [ordersChartData, setOrdersChartData] = useState<any>(null);
  const [categoryChartData, setCategoryChartData] = useState<any>(null);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  useEffect(() => {
    const tab = searchParams.get('tab') || 'analytics';
    setActiveTab(tab);
  }, [searchParams]);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchDashboardStats();
      fetchStores(); // Also fetch stores for analytics display
    } else if (activeTab === 'medicines') {
      fetchMedicines();
    } else if (activeTab === 'stores') {
      fetchStores();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const [statsResponse, revenueResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get(`${API_BASE_URL}/admin/dashboard/revenue/last7days`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);
      setDashboardStats(statsResponse.data);
      prepareChartData(statsResponse.data, revenueResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (stats: any, revenueData: any[]) => {
    // Revenue chart - Last 7 days (real data from backend)
    const labels = revenueData.map(item => item.date);
    const revenues = revenueData.map(item => item.revenue);

    setRevenueChartData({
      labels: labels,
      datasets: [{
        label: 'Revenue (₹)',
        data: revenues,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4
      }]
    });

    // Orders chart - By status
    setOrdersChartData({
      labels: ['Pending', 'Received', 'Delivered', 'Cancelled'],
      datasets: [{
        label: 'Orders',
        data: [
          Math.floor(stats.totalOrders * 0.15),
          Math.floor(stats.totalOrders * 0.25),
          Math.floor(stats.totalOrders * 0.55),
          Math.floor(stats.totalOrders * 0.05)
        ],
        backgroundColor: [
          'rgba(251, 146, 60, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          'rgb(251, 146, 60)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)'
        ],
        borderWidth: 2
      }]
    });

    // Category distribution
    setCategoryChartData({
      labels: ['Pain Relief', 'Antibiotics', 'Vitamins', 'Digestive', 'Others'],
      datasets: [{
        data: [25, 20, 18, 15, 22],
        backgroundColor: [
          'rgba(147, 51, 234, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: [
          'rgb(147, 51, 234)',
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(251, 146, 60)',
          'rgb(236, 72, 153)'
        ],
        borderWidth: 2
      }]
    });
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

  const fetchStores = async () => {
    setLoading(true);
    try {
      console.log('Fetching stores from:', `${API_BASE_URL}/stores`);
      const response = await axios.get(`${API_BASE_URL}/stores`);
      console.log('Stores fetched:', response.data);
      setStores(response.data);
    } catch (error) {
      console.error('Error fetching stores:', error);
      alert('Failed to fetch stores: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/orders/all`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Failed to fetch orders: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/medicines/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchMedicines();
      if (activeTab === 'dashboard') fetchDashboardStats();
    } catch (error) {
      console.error('Error deleting medicine:', error);
      alert('Failed to delete medicine');
    }
  };

  const handleDeleteStore = async (id) => {
    if (!confirm('Are you sure you want to delete this store?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/stores/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchStores();
      if (activeTab === 'dashboard') fetchDashboardStats();
    } catch (error) {
      console.error('Error deleting store:', error);
      alert('Failed to delete store');
    }
  };

  const handleSetCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStore) return;
    
    try {
      await axios.put(
        `${API_BASE_URL}/stores/${selectedStore.id}/credentials`,
        credentials,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Credentials updated successfully!');
      setShowSetCredentials(false);
      setSelectedStore(null);
      setCredentials({ email: '', password: '' });
      fetchStores();
    } catch (error) {
      console.error('Error updating credentials:', error);
      alert('Failed to update credentials');
    }
  };

  const openSetCredentials = (store: any) => {
    setSelectedStore(store);
    setCredentials({ email: store.email || '', password: '' });
    setShowSetCredentials(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Set Credentials Modal */}
      {showSetCredentials && selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 gradient-text">Set Store Login Credentials</h3>
            <p className="text-gray-600 mb-4">Store: <span className="font-semibold">{selectedStore.name}</span></p>
            <form onSubmit={handleSetCredentials}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="store@example.com"
                    className="input"
                    value={credentials.email}
                    onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="input"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                    minLength={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="btn btn-primary flex-1">Update Credentials</button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSetCredentials(false);
                    setSelectedStore(null);
                    setCredentials({ email: '', password: '' });
                  }}
                  className="btn btn-outline flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">🎯 Admin Dashboard</h1>
        <p className="text-white text-opacity-90">Welcome back, {user?.name}! Manage your platform efficiently.</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg p-2 mb-8">
        <div className="flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📊 Analytics
          </button>
          <button
            onClick={() => setActiveTab('medicines')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'medicines'
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💊 Medicines
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'stores'
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🏪 Stores
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 whitespace-nowrap ${
              activeTab === 'orders'
                ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📦 All Orders
          </button>
        </div>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'analytics' && (
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading analytics...</p>
            </div>
          ) : dashboardStats ? (
            <>
              {/* Primary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                      <p className="text-3xl font-bold mt-2">{formatCurrency(dashboardStats.totalRevenue)}</p>
                      <p className="text-green-100 text-xs mt-1">All time</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">Today's Revenue</p>
                      <p className="text-3xl font-bold mt-2">{formatCurrency(dashboardStats.todayRevenue)}</p>
                      <p className="text-blue-100 text-xs mt-1">{dashboardStats.todayOrders} orders</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm font-medium">Avg Daily Sales</p>
                      <p className="text-3xl font-bold mt-2">{formatCurrency(dashboardStats.averageDailySales)}</p>
                      <p className="text-purple-100 text-xs mt-1">Per day average</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm font-medium">Avg Monthly Sales</p>
                      <p className="text-3xl font-bold mt-2">{formatCurrency(dashboardStats.averageMonthlySales)}</p>
                      <p className="text-orange-100 text-xs mt-1">Per month average</p>
                    </div>
                    <div className="bg-white bg-opacity-20 p-4 rounded-xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-primary-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Medicines</p>
                      <p className="text-3xl font-bold text-primary-600 mt-2">{dashboardStats.totalMedicines}</p>
                    </div>
                    <div className="bg-primary-100 p-4 rounded-xl">
                      <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-secondary-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Active Stores</p>
                      <p className="text-3xl font-bold text-secondary-600 mt-2">{dashboardStats.activeStores}/{dashboardStats.totalStores}</p>
                    </div>
                    <div className="bg-secondary-100 p-4 rounded-xl">
                      <svg className="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-accent-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Total Orders</p>
                      <p className="text-3xl font-bold text-accent-600 mt-2">{dashboardStats.totalOrders}</p>
                    </div>
                    <div className="bg-accent-100 p-4 rounded-xl">
                      <svg className="w-8 h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-red-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Low Stock Items</p>
                      <p className="text-3xl font-bold text-red-600 mt-2">{dashboardStats.lowStockMedicines}</p>
                    </div>
                    <div className="bg-red-100 p-4 rounded-xl">
                      <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Overview */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">📈 Monthly Overview</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                    <p className="text-blue-700 font-semibold mb-2">This Month Orders</p>
                    <p className="text-4xl font-bold text-blue-900">{dashboardStats.monthlyOrders}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <p className="text-green-700 font-semibold mb-2">Total Users</p>
                    <p className="text-4xl font-bold text-green-900">{dashboardStats.totalUsers}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                    <p className="text-purple-700 font-semibold mb-2">Today's Orders</p>
                    <p className="text-4xl font-bold text-purple-900">{dashboardStats.todayOrders}</p>
                  </div>
                </div>
              </div>

              {/* Analytics Charts */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {/* Revenue Trend Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">📊 Revenue Trend (Last 7 Days)</h3>
                  {revenueChartData && (
                    <Line 
                      data={revenueChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: true,
                            position: 'top' as const,
                          },
                          title: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: function(value) {
                                return '₹' + value.toLocaleString('en-IN');
                              }
                            }
                          }
                        }
                      }}
                    />
                  )}
                </div>

                {/* Orders Status Chart */}
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">📦 Orders by Status</h3>
                  {ordersChartData && (
                    <Bar 
                      data={ordersChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false
                          },
                          title: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  )}
                </div>
              </div>

              {/* Category Distribution Chart */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="md:col-span-2 bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">🏪 Registered Stores</h3>
                  <div className="space-y-4">
                    {stores.length > 0 ? (
                      stores.slice(0, 4).map((store, index) => (
                        <div key={store.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                              #{index + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">{store.name}</p>
                              <p className="text-sm text-gray-500">{store.city}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600">{store.phone || 'No phone'}</p>
                            <p className={`text-xs font-semibold ${store.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'}`}>
                              {store.status || 'ACTIVE'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No stores registered yet</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">🔖 Medicine Categories</h3>
                  {categoryChartData && (
                    <Doughnut 
                      data={categoryChartData}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom' as const,
                            labels: {
                              boxWidth: 12,
                              font: {
                                size: 11
                              }
                            }
                          }
                        }
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">No data available</div>
          )}
        </div>
      )}

      {/* Medicines Tab */}
      {activeTab === 'medicines' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">💊 Medicine Inventory</h2>
            <button
              onClick={() => setShowAddMedicine(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Medicine
            </button>
          </div>

          {showAddMedicine && (
            <AddMedicine
              onClose={() => {
                setShowAddMedicine(false);
                fetchMedicines();
              }}
            />
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {medicines.length > 0 ? medicines.map((medicine) => (
                <div key={medicine.id} className="card hover:border-primary-300 border-2 border-transparent transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{medicine.name}</h3>
                        <span className={`badge ${medicine.stock > 50 ? 'badge-green' : medicine.stock > 0 ? 'badge-orange' : 'badge-red'}`}>
                          {medicine.stock > 50 ? 'In Stock' : medicine.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        {medicine.salt && (
                          <div>
                            <span className="text-gray-500">Salt:</span>
                            <span className="ml-2 font-semibold text-blue-700">{medicine.salt}</span>
                          </div>
                        )}
                        {medicine.type && (
                          <div>
                            <span className="text-gray-500">Type:</span>
                            <span className="ml-2 font-semibold text-purple-700">{medicine.type}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <span className="ml-2 font-semibold text-secondary-700">{medicine.category || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <span className="ml-2 font-semibold text-primary-700">₹{medicine.price}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock:</span>
                          <span className="ml-2 font-semibold">{medicine.stock} units</span>
                        </div>
                      </div>
                      {medicine.description && (
                        <p className="text-gray-600 text-sm mt-2">{medicine.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteMedicine(medicine.id)}
                      className="ml-4 p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg">No medicines found</p>
                  <p className="text-sm mt-2">Click "Add Medicine" to get started</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Stores Tab */}
      {activeTab === 'stores' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🏪 Pharmacy Stores</h2>
            <button
              onClick={() => setShowAddStore(true)}
              className="btn btn-secondary flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Store
            </button>
          </div>

          {showAddStore && (
            <AddStore
              onClose={() => {
                setShowAddStore(false);
                fetchStores();
              }}
            />
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-secondary-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {stores.length > 0 ? stores.map((store) => (
                <div key={store.id} className="card hover:border-secondary-300 border-2 border-transparent transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{store.name}</h3>
                      <span className={`badge ${store.status === 'Active' ? 'badge-green' : 'badge-red'}`}>
                        {store.status}
                      </span>
                      {store.email && (
                        <p className="text-sm text-gray-600 mt-1">
                          <span className="font-semibold">Email:</span> {store.email}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openSetCredentials(store)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300"
                        title="Set Login Credentials"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteStore(store.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                        title="Delete Store"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-secondary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">{store.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-5 h-5 text-secondary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      <span className="text-sm font-semibold">{store.city}</span>
                    </div>
                    {store.phone && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-secondary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <span className="text-sm">{store.phone}</span>
                      </div>
                    )}
                    {store.timings && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <svg className="w-5 h-5 text-secondary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm">{store.timings}</span>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">Location:</span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {store.latitude?.toFixed(4)}, {store.longitude?.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-12 text-gray-500">
                  <p className="text-lg">No stores found</p>
                  <p className="text-sm mt-2">Click "Add Store" to get started</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">📦 All Store Orders</h2>
            <p className="text-gray-600 mt-1">View and manage all orders across all stores</p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.length > 0 ? orders.map((order) => (
                <div key={order.id} className="card hover:shadow-lg transition-all">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-gray-100">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-800">Order #{order.id}</h3>
                        <span className={`badge ${
                          order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                          order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { 
                          day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) : '—'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold text-orange-600">₹{Number(order.totalAmount || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid md:grid-cols-2 gap-6 py-4">
                    {/* Customer Info */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Customer
                      </h4>
                      <p className="text-gray-700">{order.user?.name || 'N/A'}</p>
                      <p className="text-sm text-gray-500">{order.user?.email || ''}</p>
                    </div>

                    {/* Store Info */}
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        Assigned Store
                      </h4>
                      {order.store ? (
                        <>
                          <p className="text-gray-700 font-medium">{order.store.name}</p>
                          <p className="text-sm text-gray-500">{order.store.address}</p>
                          {order.store.phone && <p className="text-sm text-gray-500">📞 {order.store.phone}</p>}
                        </>
                      ) : (
                        <p className="text-gray-500">Not assigned</p>
                      )}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  {order.address && (
                    <div className="py-4 border-t border-gray-100">
                      <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Delivery Address
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {order.address.fullName}, {order.address.addressLine1}
                        {order.address.addressLine2 && `, ${order.address.addressLine2}`}, 
                        {order.address.city}, {order.address.state} - {order.address.zipCode}
                      </p>
                    </div>
                  )}

                  {/* Order Items */}
                  <div className="py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-800">Items ({order.items?.length || 0})</h4>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                        className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                      >
                        {expandedOrder === order.id ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                    {expandedOrder === order.id && order.items && (
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{item.medicine?.name || item.name || 'Item'}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{Number(item.price || 0).toFixed(2)}</p>
                            </div>
                            <p className="font-bold text-orange-600">₹{(Number(item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="card text-center py-16">
                  <svg className="w-32 h-32 mx-auto text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h3>
                  <p className="text-gray-600">All store orders will appear here</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
