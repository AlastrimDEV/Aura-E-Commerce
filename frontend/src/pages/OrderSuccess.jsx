import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { getOrderById } from '../api/orderApi';
import { verifyEsewaPayment } from '../api/paymentApi';
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleOrderInit();
    window.scrollTo(0, 0);
  }, [id, location.search]);

  const handleOrderInit = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(location.search);
      const esewaData = queryParams.get('data');

      if (esewaData) {
        try {
          await verifyEsewaPayment(esewaData, id);
        } catch (vErr) {
          console.error("eSewa verification notice:", vErr);
        }
      }

      const data = await getOrderById(id);
      setOrder(data);
    } catch (err) {
      console.error("Fetch order error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-3xl mx-auto min-h-screen">
      <div className="bg-white border border-stone-200 p-8 md:p-12 text-center space-y-6 shadow-sm">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto stroke-[1.5] animate-fade-in" />
        
        <div>
          <span className="text-xs uppercase tracking-wide text-stone-400 font-medium">THANK YOU FOR YOUR ORDER</span>
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-neutral-900 mt-2">ORDER CONFIRMED</h1>
          <p className="text-stone-500 text-xs mt-3 uppercase tracking-normal">
            Order Reference: <span className="font-mono text-black font-semibold">#{id}</span>
          </p>
        </div>

        <p className="text-stone-600 text-sm max-w-md mx-auto font-light leading-relaxed">
          We have received your order and are preparing your garments for shipment. A confirmation summary has been logged to your account.
        </p>

        {loading ? (
          <div className="py-8 text-stone-400 text-xs">Loading order details...</div>
        ) : order ? (
          <div className="bg-stone-50 border border-stone-100 p-6 text-left space-y-4 rounded-xs">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3 text-xs">
              <span className="font-semibold text-neutral-900 uppercase tracking-normal">Status</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] uppercase font-bold tracking-normal rounded-xs">
                {order.status}
              </span>
            </div>

            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div>
                    <p className="font-medium text-neutral-900">{item.productId?.name || "Garment"}</p>
                    <p className="text-stone-400">Qty: {item.qty} • Rs. {item.price}</p>
                  </div>
                  <span className="font-semibold text-neutral-900">Rs. {item.qty * item.price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-3 flex justify-between items-center text-xs font-bold text-neutral-900">
              <span>Total Amount Paid/Due</span>
              <span>Rs. {order.totalAmount?.toLocaleString()}</span>
            </div>
          </div>
        ) : null}

        <div className="pt-6 flex flex-col sm:flex-row justify-center gap-4 text-xs uppercase tracking-wide font-medium">
          <Link
            to="/orders"
            className="bg-black text-white px-8 py-4 flex items-center justify-center space-x-2 hover:bg-neutral-800 transition"
          >
            <Package className="w-4 h-4" />
            <span>View My Orders</span>
          </Link>
          <Link
            to="/shop"
            className="border border-stone-900 text-black px-8 py-4 flex items-center justify-center space-x-2 hover:bg-black hover:text-white transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
