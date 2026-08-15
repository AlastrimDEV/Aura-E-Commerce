import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getAdminStats, getAllOrders, updateOrderStatus, createProductAdmin, deleteProductAdmin } from '../api/adminApi';
import { getProducts } from '../api/productApi';
import { Shield, Package, ShoppingCart, DollarSign, Users, Plus, Trash2, Edit, RefreshCw, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Modal Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    category: 'Hoodies',
    price: '',
    stock: '',
    sizes: 'S, M, L, XL',
    imageUrl: ''
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData, productsData] = await Promise.all([
        getAdminStats(),
        getAllOrders(),
        getProducts()
      ]);
      setStats(statsData);
      if (Array.isArray(ordersData)) setOrders(ordersData);
      if (Array.isArray(productsData)) setProducts(productsData);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProductAdmin(productId);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const created = await createProductAdmin(newProduct);
      setProducts([created, ...products]);
      setShowAddProductModal(false);
      setNewProduct({
        name: '',
        description: '',
        category: 'Hoodies',
        price: '',
        stock: '',
        sizes: 'S, M, L, XL',
        imageUrl: ''
      });
      alert("Product created successfully!");
    } catch (err) {
      alert("Failed to create product");
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="pt-32 pb-24 text-center max-w-md mx-auto px-6">
        <Shield className="w-12 h-12 mx-auto text-amber-600 stroke-[1.5]" />
        <h2 className="text-2xl font-serif font-medium mt-4">Admin Access Required</h2>
        <p className="text-stone-500 text-xs mt-2 uppercase tracking-wide">
          You must be logged in as an administrator to access this area.
        </p>
        <Link to="/" className="mt-6 inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-wide font-medium">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-stone-200 pb-6 mb-8 gap-4">
        <div>
          <span className="text-xs uppercase tracking-wide text-amber-600 font-bold flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> AURA ADMIN CONTROL
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mt-1">STORE MANAGEMENT</h1>
        </div>

        <button
          onClick={loadDashboardData}
          className="flex items-center gap-2 text-xs uppercase tracking-wide border border-stone-300 px-4 py-2 hover:bg-stone-100 transition font-medium"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-stone-200 pb-px text-xs uppercase tracking-wide font-medium mb-8">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-2 border-b-2 transition ${
            activeTab === 'overview' ? 'border-black text-black font-semibold' : 'border-transparent text-stone-400 hover:text-black'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-2 border-b-2 transition ${
            activeTab === 'products' ? 'border-black text-black font-semibold' : 'border-transparent text-stone-400 hover:text-black'
          }`}
        >
          Products ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 border-b-2 transition ${
            activeTab === 'orders' ? 'border-black text-black font-semibold' : 'border-transparent text-stone-400 hover:text-black'
          }`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-stone-400 text-sm">Loading admin telemetry...</div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-fade-in">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-stone-50 border border-stone-200 p-6 rounded-xs space-y-2">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[11px] uppercase tracking-normal font-medium">Total Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-neutral-900">
                    Rs. {stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : 0}
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-6 rounded-xs space-y-2">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[11px] uppercase tracking-normal font-medium">Total Orders</span>
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-neutral-900">{stats?.totalOrders || 0}</p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-6 rounded-xs space-y-2">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[11px] uppercase tracking-normal font-medium">Garment Items</span>
                    <Package className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-neutral-900">{stats?.totalProducts || 0}</p>
                </div>

                <div className="bg-stone-50 border border-stone-200 p-6 rounded-xs space-y-2">
                  <div className="flex justify-between items-center text-stone-400">
                    <span className="text-[11px] uppercase tracking-normal font-medium">Registered Users</span>
                    <Users className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-3xl font-serif font-bold text-neutral-900">{stats?.totalUsers || 0}</p>
                </div>
              </div>

              {/* Recent Orders Preview */}
              <div>
                <h3 className="text-lg font-serif font-medium mb-4">Recent Orders</h3>
                <div className="bg-white border border-stone-200 overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-stone-400">
                      <tr>
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Total</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id}>
                          <td className="p-4 font-mono font-medium">#{order._id.substring(0, 8)}...</td>
                          <td className="p-4">{order.user?.name || "Guest"} ({order.user?.email})</td>
                          <td className="p-4 font-semibold">Rs. {order.totalAmount}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 bg-amber-100 text-amber-800 font-bold uppercase text-[9px]">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-serif font-medium">Garment Inventory</h3>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-black text-white px-5 py-2.5 text-xs uppercase tracking-wide font-medium flex items-center gap-2 hover:bg-neutral-800 transition"
                >
                  <Plus className="w-4 h-4" /> Add New Garment
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(product => (
                  <div key={product._id} className="border border-stone-200 bg-white p-4 flex space-x-4 items-center">
                    <img src={product.imageUrl} alt={product.name} className="w-20 h-24 object-cover object-top bg-stone-100 shrink-0" />
                    <div className="flex-1 min-w-0 space-y-1">
                      <span className="text-[10px] uppercase tracking-normal text-stone-400 block font-medium">{product.category}</span>
                      <h4 className="text-xs font-semibold text-neutral-900 truncate">{product.name}</h4>
                      <p className="text-xs text-neutral-600 font-medium">Rs. {product.price} • Stock: {product.stock}</p>
                      
                      <div className="pt-2 flex gap-2">
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-[10px] uppercase tracking-normal font-medium text-red-600 hover:underline flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="animate-fade-in">
              <div className="bg-white border border-stone-200 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 uppercase tracking-wider text-stone-500">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items Summary</th>
                      <th className="p-4">Total Amount</th>
                      <th className="p-4">Status Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td className="p-4 font-mono font-medium">#{order._id}</td>
                        <td className="p-4">
                          <p className="font-semibold text-neutral-900">{order.user?.name || "Customer"}</p>
                          <p className="text-stone-400 text-[10px]">{order.user?.email}</p>
                        </td>
                        <td className="p-4 text-stone-600">
                          {order.items?.map((i, idx) => (
                            <div key={idx}>{i.productId?.name || "Garment"} (x{i.qty})</div>
                          ))}
                        </td>
                        <td className="p-4 font-bold text-neutral-900">Rs. {order.totalAmount?.toLocaleString()}</td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="bg-stone-50 border border-stone-300 px-3 py-1.5 text-xs uppercase font-medium outline-none focus:border-black cursor-pointer"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ADD PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddProductModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-serif font-bold text-neutral-900 mb-6">Add New Garment</h2>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-600 uppercase tracking-wider mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="e.g. Minimalist Trench Coat"
                  className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-stone-600 uppercase tracking-wider mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Garment details, material, fit info..."
                  className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 uppercase tracking-wider mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black uppercase"
                  >
                    <option value="Hoodies">Hoodies</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Pants">Pants</option>
                    <option value="Shirts">Shirts</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 uppercase tracking-wider mb-1">Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="2999"
                    className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-600 uppercase tracking-wider mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    placeholder="25"
                    className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 uppercase tracking-wider mb-1">Available Sizes *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.sizes}
                    onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-600 uppercase tracking-wider mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-stone-50 border border-stone-200 p-3 outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-4 uppercase tracking-wide text-xs font-semibold hover:bg-neutral-800 transition mt-4"
              >
                Create Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
