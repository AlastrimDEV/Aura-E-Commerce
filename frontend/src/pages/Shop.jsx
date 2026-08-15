import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { getProducts } from '../api/productApi';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      if (Array.isArray(data)) {
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "All",
    "Hoodies",
    "T-Shirts",
    "Jackets",
    "Pants",
    "Shirts",
    "Accessories"
  ];

  // Filter & Sort Logic
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase tracking-wide text-stone-400 font-medium">AURA CATALOGUE</span>
        <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-neutral-900 mt-2">
          COLLECTION
        </h1>
        <p className="mt-3 text-stone-500 text-sm tracking-wide">
          Architectural silhouettes, raw textures, and understated apparel.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 border-b border-stone-200 pb-6">
        {/* Category Pills */}
        <div className="flex flex-wrap justify-center md:justify-start gap-3 text-xs uppercase tracking-wide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 transition-all duration-200 border rounded-xs ${
                selectedCategory === category
                  ? "bg-black text-white border-black font-medium"
                  : "bg-stone-50 text-neutral-600 border-stone-200 hover:border-neutral-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search garments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 pl-9 pr-4 py-2 text-xs outline-none focus:border-black transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-stone-50 border border-stone-200 px-3 py-2 text-xs uppercase tracking-normal text-neutral-800 outline-none focus:border-black cursor-pointer pr-8"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Count Indicator */}
      <div className="mt-6 flex justify-between items-center text-xs text-stone-400">
        <span>Showing {filteredProducts.length} results</span>
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")} 
            className="text-neutral-900 underline hover:text-stone-500"
          >
            Clear search
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div className="mt-10">
        {loading ? (
          <div className="py-24 text-center text-stone-400 text-sm">
            Loading garments...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <SlidersHorizontal className="w-8 h-8 mx-auto text-stone-300 stroke-[1]" />
            <p className="text-stone-500 font-medium">No garments match your filters.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchTerm("");
              }}
              className="text-xs uppercase tracking-wide underline text-black mt-2 inline-block"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {filteredProducts.map((product) => (
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
      </div>
    </div>
  );
};

export default Shop;