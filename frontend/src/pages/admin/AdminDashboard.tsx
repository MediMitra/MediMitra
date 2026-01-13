import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('medicines');
  const [medicines, setMedicines] = useState([
    { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', price: 50, stock: 500, manufacturer: 'PharmaCo', status: 'In Stock' },
    { id: 2, name: 'Amoxicillin 250mg', category: 'Antibiotic', price: 120, stock: 200, manufacturer: 'MediLife', status: 'In Stock' },
    { id: 3, name: 'Cetirizine 10mg', category: 'Allergy', price: 80, stock: 300, manufacturer: 'HealthCare', status: 'In Stock' },
    { id: 4, name: 'Omeprazole 20mg', category: 'Digestive', price: 150, stock: 150, manufacturer: 'WellMed', status: 'Low Stock' },
  ]);

  const [stores, setStores] = useState([
    { id: 101, name: 'MediPlus Pharmacy', location: 'Downtown', contact: '+91-9876543210', medicines: 450, status: 'Active' },
    { id: 102, name: 'HealthCare Store', location: 'Uptown', contact: '+91-9876543211', medicines: 380, status: 'Active' },
    { id: 103, name: 'WellCare Pharmacy', location: 'Central', contact: '+91-9876543212', medicines: 520, status: 'Active' },
  ]);

  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [showAddStore, setShowAddStore] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '', category: '', price: '', stock: '', manufacturer: ''
  });
  const [newStore, setNewStore] = useState({
    name: '', location: '', contact: ''
  });

  const handleAddMedicine = (e) => {
    e.preventDefault();
    const medicine = {
      id: Date.now(),
      ...newMedicine,
      status: parseInt(newMedicine.stock) > 100 ? 'In Stock' : 'Low Stock'
    };
    setMedicines([...medicines, medicine]);
    setNewMedicine({ name: '', category: '', price: '', stock: '', manufacturer: '' });
    setShowAddMedicine(false);
  };

  const handleAddStore = (e) => {
    e.preventDefault();
    const store = {
      id: Date.now(),
      ...newStore,
      medicines: 0,
      status: 'Active'
    };
    setStores([...stores, store]);
    setNewStore({ name: '', location: '', contact: '' });
    setShowAddStore(false);
  };

  const handleDeleteMedicine = (id) => {
    setMedicines(medicines.filter(m => m.id !== id));
  };

  const handleDeleteStore = (id) => {
    setStores(stores.filter(s => s.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-8 mb-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-primary-100">Welcome back, {user?.name}! Manage your platform efficiently.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium">Total Medicines</p>
              <p className="text-4xl font-bold mt-2">{medicines.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-secondary-100 text-sm font-medium">Active Stores</p>
              <p className="text-4xl font-bold mt-2">{stores.length}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-accent-100 text-sm font-medium">Total Stock</p>
              <p className="text-4xl font-bold mt-2">{medicines.reduce((sum, m) => sum + parseInt(m.stock), 0)}</p>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-xl">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Low Stock Items</p>
              <p className="text-4xl font-bold mt-2">{medicines.filter(m => m.status === 'Low Stock').length}</p>
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
            onClick={() => setActiveTab('medicines')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'medicines'
                ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            💊 Medicines
          </button>
          <button
            onClick={() => setActiveTab('stores')}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
              activeTab === 'stores'
                ? 'bg-gradient-to-r from-secondary-600 to-secondary-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🏪 Stores
          </button>
        </div>
      </div>

      {/* Medicines Tab */}
      {activeTab === 'medicines' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Medicine Inventory</h2>
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

          {/* Add Medicine Modal */}
          {showAddMedicine && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 gradient-text">Add New Medicine</h3>
                <form onSubmit={handleAddMedicine}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Medicine Name"
                      className="input"
                      value={newMedicine.name}
                      onChange={(e) => setNewMedicine({...newMedicine, name: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      className="input"
                      value={newMedicine.category}
                      onChange={(e) => setNewMedicine({...newMedicine, category: e.target.value})}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      className="input"
                      value={newMedicine.price}
                      onChange={(e) => setNewMedicine({...newMedicine, price: e.target.value})}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Stock Quantity"
                      className="input"
                      value={newMedicine.stock}
                      onChange={(e) => setNewMedicine({...newMedicine, stock: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Manufacturer"
                      className="input"
                      value={newMedicine.manufacturer}
                      onChange={(e) => setNewMedicine({...newMedicine, manufacturer: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button type="submit" className="btn btn-primary flex-1">Add Medicine</button>
                    <button
                      type="button"
                      onClick={() => setShowAddMedicine(false)}
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
            {medicines.map((medicine) => (
              <div key={medicine.id} className="card hover:border-primary-300 border-2 border-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{medicine.name}</h3>
                      <span className={`badge ${medicine.status === 'In Stock' ? 'badge-green' : 'badge-orange'}`}>
                        {medicine.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <span className="ml-2 font-semibold text-secondary-700">{medicine.category}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Price:</span>
                        <span className="ml-2 font-semibold text-primary-700">₹{medicine.price}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Stock:</span>
                        <span className="ml-2 font-semibold">{medicine.stock} units</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Manufacturer:</span>
                        <span className="ml-2 font-semibold">{medicine.manufacturer}</span>
                      </div>
                    </div>
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
            ))}
          </div>
        </div>
      )}

      {/* Stores Tab */}
      {activeTab === 'stores' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Pharmacy Stores</h2>
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

          {/* Add Store Modal */}
          {showAddStore && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                <h3 className="text-2xl font-bold mb-6 gradient-text">Add New Store</h3>
                <form onSubmit={handleAddStore}>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Store Name"
                      className="input"
                      value={newStore.name}
                      onChange={(e) => setNewStore({...newStore, name: e.target.value})}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      className="input"
                      value={newStore.location}
                      onChange={(e) => setNewStore({...newStore, location: e.target.value})}
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Contact Number"
                      className="input"
                      value={newStore.contact}
                      onChange={(e) => setNewStore({...newStore, contact: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex gap-4 mt-6">
                    <button type="submit" className="btn btn-secondary flex-1">Add Store</button>
                    <button
                      type="button"
                      onClick={() => setShowAddStore(false)}
                      className="btn btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {stores.map((store) => (
              <div key={store.id} className="card hover:border-secondary-300 border-2 border-transparent">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{store.name}</h3>
                    <span className="badge badge-blue">{store.status}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{store.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>{store.contact}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <svg className="w-5 h-5 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span>{store.medicines} medicines available</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
