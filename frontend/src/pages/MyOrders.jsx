import React, { useEffect, useState, useContext } from 'react';
import { getMyOrders } from '../api/orderApi';
import { AuthContext } from '../context/AuthContext';
import { Package, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getMyOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Fetch my orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  if (!user) {
    return (
      <div className="pt-32 pb-24 text-center max-w-md mx-auto px-6">
        <Package className="w-12 h-12 mx-auto text-stone-300 stroke-[1]" />
        <h2 className="text-2xl font-serif font-medium mt-4">Please Sign In</h2>
        <p className="text-stone-500 text-xs mt-2 uppercase tracking-wide">Sign in to view your order history and track shipments</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-10 border-b border-stone-200 pb-6">
        <span className="text-xs uppercase tracking-wide text-stone-400 font-medium">ACCOUNT HISTORY</span>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-neutral-900 mt-1">MY ORDERS</h1>
      </div>

      {loading ? (
        <div className="py-24 text-center text-stone-400 text-sm">Loading your orders...</div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center space-y-4 border border-stone-200 bg-stone-50 p-12">
          <Package className="w-12 h-12 mx-auto text-stone-300 stroke-[1]" />
          <h3 className="text-lg font-serif font-medium">No Orders Yet</h3>
          <p className="text-stone-500 text-xs uppercase tracking-wide max-w-sm mx-auto">
            You haven't placed any garment orders with AURA yet.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-black text-white px-8 py-3.5 text-xs uppercase tracking-wide hover:bg-neutral-800 transition mt-4 font-medium"
          >
            Explore Collection
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order._id} className="bg-white border border-stone-200 p-6 md:p-8 shadow-xs rounded-xs space-y-6">
              {/* Order Top Bar */}
              <div className="flex flex-wrap justify-between items-start gap-4 border-b border-stone-100 pb-4">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase tracking-normal block font-medium">ORDER ID</span>
                  <span className="font-mono text-xs font-semibold text-neutral-900">#{order._id}</span>
                  <div className="flex items-center space-x-2 text-stone-400 text-xs mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 border text-[11px] font-semibold uppercase tracking-normal rounded-xs ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>
                  <span className="text-base font-serif font-bold text-neutral-900">
                    Rs. {order.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="grid md:grid-cols-2 gap-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 bg-stone-50 p-3 rounded-xs border border-stone-100">
                    {item.productId?.imageUrl ? (
                      <img src={item.productId.imageUrl} alt={item.productId.name} className="w-14 h-16 object-cover object-top rounded-xs bg-stone-200 shrink-0" />
                    ) : (
                      <div className="w-14 h-16 bg-stone-200 flex items-center justify-center text-stone-400 text-[10px]">No Img</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-900 truncate">{item.productId?.name || "Garment Item"}</p>
                      <p className="text-[11px] text-stone-400 uppercase tracking-normal mt-0.5">
                        Qty: {item.qty} • Rs. {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address Footer */}
              {order.address && (
                <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100 flex justify-between items-center">
                  <span>
                    Ship to: <strong className="text-neutral-800 font-medium">{order.address.fullName}</strong> ({order.address.street}, {order.address.city}, {order.address.country})
                  </span>
                  <span className="text-stone-400 uppercase tracking-normal font-medium">
                    Payment: {order.paymentId?.startsWith('COD') ? 'Cash on Delivery' : 'Paid Online'}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
