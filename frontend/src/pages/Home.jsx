import React, { useState, useEffect } from 'react';
import HeroImage from '../assets/heroimage.png';
import Card from '../components/Card';
import { getProducts } from '../api/productApi';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then((data) => {
      if (Array.isArray(data)) {
        setProducts(data);
      }
    }).catch(err => console.error(err));
  }, []);

  const topSellers = products.slice(0, 4);

  return (
    <div className="bg-cream">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <img
          src={HeroImage}
          alt="AURA Hero"
          className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.85]"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/40" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center text-white px-6 max-w-4xl mx-auto">
          <p className="mb-4 text-xs tracking-wide uppercase text-stone-300 font-medium">
            SPRING / SUMMER 2026 COLLECTION
          </p>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold tracking-tight leading-none uppercase">
            AURA
          </h1>

          <p className="mt-6 text-sm md:text-base text-stone-200 tracking-normal max-w-lg font-light">
            Architectural tailoring and understated luxury designed for everyday movement.
          </p>

          <Link
            to="/shop"
            className="mt-10 border border-white/80 bg-white/10 backdrop-blur-xs text-white px-9 py-4 text-xs uppercase tracking-wide font-medium hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2 group"
          >
            <span>Explore Collection</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Bottom Hero Bar */}
        <div className="absolute bottom-8 left-0 right-0 px-8 md:px-12 text-white/70 z-10">
          <ul className="flex justify-between items-center text-[10px] tracking-wide font-medium uppercase border-t border-white/20 pt-4">
            <li>EST. 2026</li>
            <li className="animate-bounce text-white">SCROLL TO DISCOVER</li>
            <li>AURA EDITION</li>
          </ul>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-stone-200 pb-8">
          <div>
            <span className="text-xs uppercase tracking-wide text-neutral-400 font-medium">
              CURATED SELECTION
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-medium text-neutral-900 mt-2">
              Best Sellers
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-4 md:mt-0 text-xs uppercase tracking-wide font-medium text-neutral-900 hover:text-neutral-500 transition-colors flex items-center gap-1"
          >
            View All Products &rarr;
          </Link>
        </div>

        {topSellers.length === 0 ? (
          <div className="text-center py-12 text-stone-400 text-sm">
            Loading collection...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {topSellers.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`}>
                <Card
                  image={product.imageUrl}
                  category={product.category}
                  title={product.name}
                  price={product.price}
                />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Brand Ethos Banner */}
      <section className="bg-stone-900 text-stone-100 py-24 px-8">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <Sparkles className="w-8 h-8 mx-auto text-stone-400 stroke-[1]" />
          <h2 className="text-3xl md:text-5xl font-serif font-normal leading-tight tracking-wide">
            "We create garments stripped of excess, built on premium textiles, clean lines, and timeless craftsmanship."
          </h2>
          <p className="text-xs uppercase tracking-wide text-stone-400 pt-4">
            AURA ATELIER PHILOSOPHY
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;