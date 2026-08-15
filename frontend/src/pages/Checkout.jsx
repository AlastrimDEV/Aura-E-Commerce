import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createOrder } from '../api/orderApi';
import { initiateEsewaPayment } from '../api/paymentApi';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, Wallet, ArrowLeft } from 'lucide-react';
import LoginModal from '../components/LoginModal';

const Checkout = () => {
  const { cartItems, totalAmount, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('esewa');

  const [address, setAddress] = useState({
    fullName: user ? user.name : '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Nepal',
    phone: '',
  });

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleEsewaRedirect = (esewaData) => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = esewaData.esewa_payment_url;

    const fields = [
      'amount',
      'tax_amount',
      'total_amount',
      'transaction_uuid',
      'product_code',
      'product_service_charge',
      'product_delivery_charge',
      'success_url',
      'failure_url',
      'signed_field_names',
      'signature',
    ];

    fields.forEach((field) => {
      if (esewaData[field] !== undefined) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = field;
        input.value = esewaData[field];
        form.appendChild(input);
      }
    });

    document.body.appendChild(form);
    form.submit();
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (cartItems.length === 0) {
      alert("Your bag is empty.");
      return;
    }

    try {
      setLoading(true);
      const items = cartItems.map(item => ({
        productId: item.product._id,
        qty: item.qty,
        price: item.product.price,
        size: item.size
      }));

      const orderPayload = {
        items,
        address: {
          fullName: address.fullName,
          street: address.street,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country
        },
        totalAmount,
        paymentId: paymentMethod === 'cod' ? `COD-${Date.now()}` : `ESEWA-PENDING-${Date.now()}`
      };

      const created = await createOrder(orderPayload);
      clearCart();

      if (paymentMethod === 'esewa') {
        const esewaData = await initiateEsewaPayment(totalAmount, created._id);
        handleEsewaRedirect(esewaData);
      } else {
        navigate(`/order-success/${created._id}`);
      }
    } catch (err) {
      console.error("Order Creation Error:", err);
      alert(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-24 text-center max-w-md mx-auto px-6">
        <h2 className="text-2xl font-serif font-medium">Your shopping bag is empty</h2>
        <p className="text-stone-500 text-xs mt-2 uppercase tracking-wide">Add items before proceeding to checkout</p>
        <Link to="/shop" className="mt-6 inline-block bg-black text-white px-8 py-3 text-xs uppercase tracking-wide hover:bg-stone-800 transition font-medium">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="mb-10 flex items-center justify-between border-b border-stone-200 pb-6">
        <div>
          <Link to="/shop" className="text-xs uppercase tracking-wide text-stone-400 hover:text-black flex items-center gap-1 font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Shop
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 mt-2">CHECKOUT</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Column: Delivery Form */}
        <div className="lg:col-span-7 space-y-8">
          {!user && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xs text-xs text-amber-800 flex justify-between items-center">
              <span>Already registered? Sign in for faster checkout.</span>
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="underline font-semibold hover:text-black"
              >
                Sign In Now
              </button>
            </div>
          )}

          <form onSubmit={handleSubmitOrder} className="space-y-6">
            <h2 className="text-lg font-serif font-medium border-b border-stone-100 pb-3">1. Shipping Address</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-normal text-stone-600 mb-1.5 font-medium">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={address.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Pratik Ojha"
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs outline-none focus:border-black transition"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-normal text-stone-600 mb-1.5 font-medium">Street Address *</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={address.street}
                  onChange={handleChange}
                  placeholder="Apartment, suite, street name"
                  className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs outline-none focus:border-black transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-normal text-stone-600 mb-1.5 font-medium">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={address.city}
                    onChange={handleChange}
                    placeholder="Kathmandu / Pokhara / etc."
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs outline-none focus:border-black transition"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-normal text-stone-600 mb-1.5 font-medium">Postal Code *</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={address.postalCode}
                    onChange={handleChange}
                    placeholder="44600"
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs outline-none focus:border-black transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-normal text-stone-600 mb-1.5 font-medium">Country *</label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={address.country}
                    onChange={handleChange}
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs outline-none focus:border-black transition"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-normal text-stone-600 mb-1.5 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={address.phone}
                    onChange={handleChange}
                    placeholder="+977 9800000000"
                    className="w-full bg-stone-50 border border-stone-200 px-4 py-3 text-xs outline-none focus:border-black transition"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="pt-6">
              <h2 className="text-lg font-serif font-medium border-b border-stone-100 pb-3 mb-4">2. Payment Method</h2>

              <div className="space-y-3">
                <label className={`flex items-center space-x-3 border p-4 cursor-pointer transition ${paymentMethod === 'esewa' ? 'border-emerald-600 bg-emerald-50/40' : 'border-stone-200'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="esewa" 
                    checked={paymentMethod === 'esewa'} 
                    onChange={() => setPaymentMethod('esewa')}
                    className="accent-emerald-600"
                  />
                  <div className="flex items-center justify-between w-full text-xs">
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold text-neutral-900">eSewa Mobile Wallet</p>
                        <span className="bg-emerald-600 text-white text-[10px] px-2 py-0.5 font-bold rounded-xs">Recommended</span>
                      </div>
                      <p className="text-stone-500 font-light mt-0.5">Instant & secure digital payment via eSewa</p>
                    </div>
                    <Wallet className="w-5 h-5 text-emerald-600" />
                  </div>
                </label>

                <label className={`flex items-center space-x-3 border p-4 cursor-pointer transition ${paymentMethod === 'cod' ? 'border-black bg-stone-50' : 'border-stone-200'}`}>
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod" 
                    checked={paymentMethod === 'cod'} 
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-black"
                  />
                  <div className="flex items-center justify-between w-full text-xs">
                    <div>
                      <p className="font-semibold text-neutral-900">Cash on Delivery (COD)</p>
                      <p className="text-stone-500 font-light mt-0.5">Pay with cash upon package arrival</p>
                    </div>
                    <Truck className="w-5 h-5 text-stone-600" />
                  </div>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-5 text-xs font-semibold uppercase tracking-wide hover:bg-neutral-800 transition shadow-lg mt-8 disabled:opacity-50"
            >
              {loading ? "Processing Order..." : paymentMethod === 'esewa' ? `Pay with eSewa • Rs. ${totalAmount.toLocaleString()}` : `Complete Order • Rs. ${totalAmount.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-stone-50 border border-stone-200 p-8 space-y-6 sticky top-28">
            <h2 className="text-lg font-serif font-medium border-b border-stone-200 pb-4">Order Summary</h2>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {cartItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="flex items-center space-x-3">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-12 h-14 object-cover object-top rounded-xs bg-stone-200" />
                    <div>
                      <p className="font-medium text-neutral-900 line-clamp-1">{item.product.name}</p>
                      <p className="text-stone-400 uppercase">Size: {item.size} • Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-neutral-900">Rs. {(item.product.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-neutral-900 font-bold text-sm pt-3 border-t border-stone-200">
                <span>Total</span>
                <span>Rs. {totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-center space-x-2 text-[11px] text-stone-400 uppercase tracking-wide font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted & Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
    </div>
  );
};

export default Checkout;
