import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getAdminStats, getAllOrders, updateOrderStatus } from '../api/adminApi';
import { getProducts } from '../api/productApi';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, ordersData, productsData] = await Promise.all([
        getAdminStats(),
        getAllOrders(),
        getProducts()
      ]);
      setStats(statsData);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Admin dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleStatusChange = async (orderId, status) => {
    await updateOrderStatus(orderId, status);
    setOrders((currentOrders) =>
      currentOrders.map((order) => (order._id === orderId ? { ...order, status } : order))
    );
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="pt-32 pb-24 text-center max-w-md mx-auto px-6">
        <h2 className="text-2xl font-serif font-medium">Admin access required</h2>
        <p className="text-stone-500 text-xs mt-3 uppercase tracking-wide">
          Sign in with an administrator account to access store management.
        </p>
        <Link to="/" className="mt-6 inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-wide font-medium">
          Return home
        </Link>
      </div>
    );
  }

  const navigation = [
    { label: 'Overview', to: '/admin' },
    { label: `Products (${products.length})`, to: '/admin/products' },
    { label: `Orders (${orders.length})`, to: '/admin/orders' }
  ];

  return (
    <div className="admin-shell -mt-0 pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-stone-200 pb-8 mb-8">
        <div>
          <p className="admin-eyebrow text-[11px] uppercase font-semibold">AURA / ADMIN</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-neutral-900 mt-2">Store management</h1>
          <p className="text-sm text-stone-500 mt-2">A calm command center for your daily operations.</p>
        </div>
        <button
          type="button"
          onClick={loadDashboardData}
          className="text-xs uppercase tracking-wide border border-stone-300 bg-white text-stone-700 px-4 py-2.5 hover:bg-stone-100 transition"
        >
          Refresh data
        </button>
      </header>

      <nav className="admin-nav flex gap-2 border p-1 mb-10 overflow-x-auto rounded-lg w-fit max-w-full">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'}
            className={({ isActive }) =>
              `px-4 py-2.5 rounded-md text-xs uppercase tracking-wide whitespace-nowrap ${
                isActive ? 'bg-neutral-900 text-white shadow-sm' : 'text-stone-500 hover:text-neutral-900 hover:bg-stone-100'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {loading ? (
        <div className="py-24 text-center text-stone-400 text-sm">Loading store data...</div>
      ) : (
        <Outlet
          context={{
            stats,
            orders,
            products,
            setProducts,
            handleStatusChange,
            refresh: loadDashboardData
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
