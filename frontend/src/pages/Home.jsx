import React, { useState, useEffect } from 'react';
import HeroImage from '../assets/heroimage.png';
import c1 from '../assets/c1.webp';
import Card from '../components/Card';
import { getProducts } from '../api/productApi';
import { Link } from 'react-router-dom';


const Home = () => {

  const [products, setProducts] = useState([])

  useEffect(()=>{
    getProducts().then(setProducts)
  }, [])

  const TopSeller = products.filter(
    (product)=> product.category === "Electronics"
  )



  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen">
        {/* Background Image */}
        <img
          src={HeroImage}
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10">
          <p className="mb-4 text-sm tracking-[0.4em] uppercase">
            SPRING / SUMMER 2026
          </p>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold leading-none text-center">
            STITCH
            <br />
            UPCOMING
          </h1>

          <button className="mt-8 border border-white px-8 py-4 text-sm tracking-wider hover:bg-white hover:text-black transition-all duration-300">
            EXPLORE COLLECTION
          </button>
        </div>

        {/* Bottom Hero Info */}
        <div className="absolute bottom-8 left-0 right-0 px-10 text-white z-10">
          <ul className="flex justify-between items-center text-sm font-medium">
            <li>EST. 2026</li>
            <li className='animate-bounce'>SCROLL</li>
            <li>STITCH</li>
          </ul>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16">
        <div className="flex flex-col items-center">
          <p className="text-gray-600 tracking-widest uppercase">
            FOR ALL WALKS OF LIFE
          </p>

          <h2 className="text-4xl font-bold mt-2">
            BEST SELLING
          </h2>
        </div>

        <div className="max-w-7xl mx-auto px-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TopSeller.map((product) => (
            <Link to={`/product/${product._id}`}><Card
            key={product._id}
            image={product.imageUrl}
            category={product.category}
            title={product.name}
            price={product.price}
          /></Link>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;