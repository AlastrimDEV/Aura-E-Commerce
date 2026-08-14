import React, { useEffect, useState } from 'react';
import c1 from '../assets/c1.webp';
import Card from '../components/Card';
import { getProducts } from '../api/productApi';
import { Link } from 'react-router-dom';


const Shop = () => {

  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredProducts = selectedCategory === "All" ? products : products.filter(
    (product) => product.category === selectedCategory
  )

  useEffect(()=>{
    getProducts().then(setProducts);
  }, [])
  
  const categories = [
    "All",
    ...new Set(products.map((product) => product.category))
  ];

  return (
    <div className="pt-32 px-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          SHOP
        </h1>

        <p className="mt-4 text-gray-500 tracking-wide">
          Minimal. Timeless. Elevated.
        </p>
      </div>

      {/* Categories */}
      <div className="flex justify-center gap-8 mt-12 text-sm uppercase tracking-wider">
          {categories.map((category)=>(
            <button key={category} onClick={()=> setSelectedCategory(category)}
            className={`transition ${
              selectedCategory === category
                ? "font-semibold"
                : "hover:text-gray-500"
            }`}>
              {category}
            </button>
          ))}
      </div>

      {/* Product Count */}
      <p className="text-center text-gray-500 mt-8">
        Showing {products.length} products
      </p>

      {/* Products */}
      <div className="max-w-7xl mx-auto mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Link key={product._id} to={`/product/${product._id}`}><Card
              key={product._id}
              image={product.imageUrl}
              category={product.category}
              title={product.name}
              price={product.price}
            /></Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;