import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';

const AdminOverview = () => {
  const { stats, orders } = useOutletContext();
  const metrics = [
    ['Total revenue', `Rs. ${(stats?.totalRevenue || 0).toLocaleString()}`],
    ['Total orders', stats?.totalOrders || 0],
    ['Products', stats?.totalProducts || 0],
    ['Registered users', stats?.totalUsers || 0]
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(([label, value]) => (
          <div key={label} className="admin-card bg-white border p-6 rounded-xl">
            <p className="text-[11px] uppercase tracking-wide text-stone-400">{label}</p>
            <p className="text-3xl font-semibold mt-3 text-neutral-900">{value}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900">Recent orders</h2>
          <Link to="/admin/orders" className="text-[11px] uppercase tracking-wide text-stone-500 hover:text-neutral-900">View all</Link>
        </div>
        <div className="admin-card admin-overview-list bg-white border overflow-x-auto rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase tracking-wide">
              <tr>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id} className="admin-overview-row">
                  <td data-label="Order" className="p-4 font-mono">#{order._id.substring(0, 8)}</td>
                  <td data-label="Customer" className="p-4">{order.user?.name || 'Guest'}</td>
                  <td data-label="Total" className="p-4">Rs. {order.totalAmount?.toLocaleString()}</td>
                  <td data-label="Status" className="p-4 text-stone-600">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminOverview;
