import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQty, totalAmount } = useContext(CartContext);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl z-10 flex flex-col justify-between animate-slide-up">
        {/* Header */}
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-5 h-5 text-neutral-800" />
            <h2 className="text-lg font-serif font-medium tracking-wide">Your Bag ({cartItems.reduce((a, c) => a + c.qty, 0)})</h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-2 text-neutral-400 hover:text-black transition-colors rounded-full hover:bg-stone-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-neutral-400 space-y-4 py-16">
              <ShoppingBag className="w-12 h-12 stroke-[1.2] text-neutral-300" />
              <p className="text-sm">Your shopping bag is currently empty.</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-4 border border-neutral-900 text-neutral-900 px-6 py-2.5 text-xs tracking-wide uppercase hover:bg-black hover:text-white transition-all duration-300"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={`${item.product._id}-${item.size}-${idx}`} className="flex space-x-4 border-b border-stone-100 pb-4">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.name} 
                  className="w-20 h-24 object-cover object-top rounded-xs bg-stone-100 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-medium text-neutral-900 line-clamp-1">{item.product.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.product._id, item.size)}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-neutral-400 mt-1 uppercase tracking-normal">Size: {item.size}</p>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center border border-neutral-200 text-xs">
                      <button 
                        onClick={() => updateQty(item.product._id, item.size, item.qty - 1)}
                        className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                      >
                        -
                      </button>
                      <span className="px-3 font-medium text-neutral-900">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.product._id, item.size, item.qty + 1)}
                        className="px-2.5 py-1 text-neutral-600 hover:bg-neutral-100"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-neutral-900">
                      Rs. {(item.product.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Summary */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-stone-100 bg-stone-50 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-semibold text-neutral-900">Rs. {totalAmount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-neutral-400">Taxes and shipping calculated at checkout.</p>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-black text-white py-4 text-xs font-semibold uppercase tracking-wide flex items-center justify-center space-x-2 hover:bg-neutral-800 transition-all duration-300 shadow-md"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
