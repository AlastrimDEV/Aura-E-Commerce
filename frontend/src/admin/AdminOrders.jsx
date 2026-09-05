import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';

const formatAddress = (address) => {
  if (!address) return 'No delivery address provided';
  return [address.street, address.city, address.postalCode, address.country].filter(Boolean).join(', ');
};

const statusStyles = {
  Pending: 'bg-stone-100 text-stone-700 border-stone-200',
  Shipped: 'bg-stone-100 text-stone-700 border-stone-200',
  Completed: 'bg-stone-100 text-stone-700 border-stone-200',
  Cancelled: 'bg-stone-100 text-stone-700 border-stone-200'
};

const AdminOrders = () => {
  const { orders, handleStatusChange } = useOutletContext();
  const [expandedOrder, setExpandedOrder] = useState(null);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-900">Orders</h2>
        <p className="text-xs text-stone-500 mt-1">Review orders at a glance. Expand one for delivery details and status.</p>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const isExpanded = expandedOrder === order._id;
          const itemNames = order.items?.map((item) => `${item.productId?.name || 'Garment'} × ${item.qty}`).join(', ');
          return (
            <article key={order._id} className={`admin-card bg-white border rounded-xl overflow-hidden ${isExpanded ? 'border-stone-400' : ''}`}>
              <div className="flex items-center gap-4 p-5 max-md:flex-wrap max-md:gap-3 max-md:p-4">
                <button
                  type="button"
                  onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-600 shrink-0 hover:bg-stone-200 transition max-md:w-7 max-md:h-7"
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} order ${order._id.substring(0, 8)}`}
                  aria-expanded={isExpanded}
                >
                  <span className={`admin-chevron ${isExpanded ? 'admin-chevron-open' : ''}`} />
                </button>
                <div className="min-w-0 flex-1 max-md:w-[calc(100%-2.75rem)]">
                  <p className="font-mono text-[11px] text-stone-500">#{order._id.substring(0, 8)}</p>
                  <p className="text-sm font-semibold text-neutral-900 mt-1 truncate">{order.address?.fullName || order.user?.name || 'Customer'}</p>
                  <p className="text-xs text-stone-500 mt-1 truncate">{itemNames || 'No items listed'}</p>
                </div>
                <span className="hidden sm:block text-xs text-stone-500 whitespace-nowrap">{order.items?.length || 0} item(s)</span>
                <span className="font-semibold text-neutral-900 whitespace-nowrap max-md:ml-11 max-md:text-sm">Rs. {order.totalAmount?.toLocaleString()}</span>
              </div>

              {isExpanded && (
                <div className="border-t border-stone-200 bg-stone-50 px-5 py-5 grid md:grid-cols-[1fr_auto] gap-6 max-md:px-4 max-md:py-4 max-md:gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.16em] text-stone-500 font-semibold">Delivery address</p>
                    <p className="text-sm font-semibold text-neutral-900 mt-2">{order.address?.fullName || 'Customer'}</p>
                    <p className="text-xs text-stone-600 leading-5 mt-1">{formatAddress(order.address)}</p>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.16em] text-stone-500 font-semibold" htmlFor={`status-${order._id}`}>Status</label>
                    <select
                      id={`status-${order._id}`}
                      value={order.status}
                      onChange={async (event) => {
                        try {
                          await handleStatusChange(order._id, event.target.value);
                        } catch (error) {
                          console.error('Update order status error:', error);
                          window.alert('Failed to update order status.');
                        }
                      }}
                      className={`block mt-2 px-3 py-2 uppercase text-[10px] rounded-md border max-md:w-full ${statusStyles[order.status] || statusStyles.Pending}`}
                    >
                      {['Pending', 'Shipped', 'Completed', 'Cancelled'].map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default AdminOrders;
