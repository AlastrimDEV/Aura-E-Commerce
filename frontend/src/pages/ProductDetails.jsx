import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getProducts } from '../api/productApi';
import Card from '../components/Card';
import { CartContext } from '../context/CartContext';
import { Check, ShoppingBag, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        } else {
          setSelectedSize('M');
        }

        const allProducts = await getProducts();
        if (Array.isArray(allProducts)) {
          const related = allProducts
            .filter((item) => item.category === data.category && item._id !== data._id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Fetch product error:", error);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="h-screen flex justify-center items-center text-stone-400 font-serif">
        Loading Garment Details...
      </div>
    );
  }

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL'];

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3500);
  };

  return (
    <div className="pt-28 pb-20">
      {/* Toast Notification */}
      {addedNotice && (
        <div className="fixed top-24 right-8 bg-black text-white text-xs tracking-wide uppercase px-6 py-4 z-[99] shadow-xl flex items-center space-x-3 border border-stone-800 animate-slide-up">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Added {product.name} ({selectedSize}) to your bag</span>
        </div>
      )}

      {/* Main Product Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Main Image View */}
          <div className="bg-stone-100 rounded-xs overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-[600px] lg:h-[750px] object-cover object-top"
            />
          </div>

          {/* Product Details Section */}
          <div className="flex flex-col justify-between h-full pt-4">
            <div>
              <span className="uppercase tracking-wide text-stone-400 text-xs font-medium">
                {product.category}
              </span>

              <h1 className="text-3xl md:text-5xl font-serif font-medium text-neutral-900 mt-2">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center space-x-4">
                <span className="text-2xl font-serif text-neutral-900">
                  Rs. {product.price.toLocaleString()}
                </span>
                <span className="text-xs tracking-normal text-emerald-600 bg-emerald-50 px-2.5 py-1 uppercase rounded-xs font-medium">
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </span>
              </div>

              {/* Description */}
              <div className="mt-8 border-t border-b border-stone-200 py-6">
                <p className="text-stone-600 text-sm leading-relaxed font-light">
                  {product.description}
                </p>
              </div>

              {/* Size Selector */}
              <div className="mt-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="uppercase text-xs tracking-wide font-medium text-neutral-800">
                    Select Size
                  </span>
                  <span className="text-[11px] text-stone-400 uppercase tracking-normal cursor-pointer hover:text-black">
                    Size Guide
                  </span>
                </div>

                <div className="flex gap-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border text-xs font-medium uppercase tracking-normal transition-all ${
                        selectedSize === size
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'border-stone-200 text-neutral-800 hover:border-neutral-400 bg-stone-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mt-8">
                <span className="uppercase text-xs tracking-wide font-medium text-neutral-800 block mb-3">
                  Quantity
                </span>
                <div className="inline-flex items-center border border-stone-200 bg-stone-50 text-xs">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-neutral-600 hover:bg-stone-200 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-5 font-medium text-neutral-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-neutral-600 hover:bg-stone-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Bag CTA */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="
                  w-full mt-10
                  bg-black text-white
                  py-5 text-xs font-semibold
                  uppercase tracking-wide
                  hover:bg-neutral-800
                  disabled:bg-stone-300 disabled:cursor-not-allowed
                  transition-all duration-300
                  flex items-center justify-center space-x-3
                  shadow-md
                "
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{product.stock > 0 ? 'Add To Bag' : 'Sold Out'}</span>
              </button>
            </div>

            {/* Guarantees */}
            <div className="mt-12 pt-8 border-t border-stone-200 grid grid-cols-3 gap-4 text-center text-[11px] text-stone-500 uppercase tracking-wide font-medium">
              <div className="flex flex-col items-center space-y-2">
                <Truck className="w-5 h-5 text-stone-700 stroke-[1.2]" />
                <span>Express Shipping</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <RotateCcw className="w-5 h-5 text-stone-700 stroke-[1.2]" />
                <span>14 Day Returns</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <ShieldCheck className="w-5 h-5 text-stone-700 stroke-[1.2]" />
                <span>100% Authentic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 md:px-12 mt-28">
          <h2 className="text-2xl font-serif font-medium text-neutral-900 mb-10 border-b border-stone-200 pb-4">
            You May Also Like
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {relatedProducts.map((item) => (
              <Link key={item._id} to={`/product/${item._id}`}>
                <Card
                  image={item.imageUrl}
                  category={item.category}
                  title={item.name}
                  price={item.price}
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;