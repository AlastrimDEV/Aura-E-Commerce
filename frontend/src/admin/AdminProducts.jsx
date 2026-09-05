import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { createProductAdmin, deleteProductAdmin } from '../api/adminApi';

const emptyProduct = {
  name: '',
  description: '',
  category: 'Hoodies',
  price: '',
  stock: '',
  sizes: 'S, M, L, XL',
  imageUrl: ''
};

const AdminProducts = () => {
  const { products, setProducts } = useOutletContext();
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductAdmin(productId);
      setProducts((currentProducts) => currentProducts.filter((product) => product._id !== productId));
    } catch (error) {
      console.error('Delete product error:', error);
      window.alert('Failed to delete product.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const created = await createProductAdmin(newProduct);
      setProducts((currentProducts) => [created, ...currentProducts]);
      setNewProduct(emptyProduct);
      setShowForm(false);
    } catch (error) {
      console.error('Create product error:', error);
      window.alert('Failed to create product.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center gap-4 max-md:flex-col max-md:items-stretch">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Products</h2>
          <p className="text-xs text-stone-500 mt-1">Manage the products available in your store.</p>
        </div>
        <button type="button" onClick={() => setShowForm(true)} className="bg-neutral-900 text-white px-5 py-2.5 text-xs uppercase tracking-wide rounded-md hover:bg-neutral-700 max-md:w-full">
          Add product
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="admin-card bg-white border p-6 space-y-4 text-xs rounded-xl">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-neutral-900">New product</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-stone-500 hover:text-neutral-900">Close</button>
          </div>
          <input required placeholder="Product name" value={newProduct.name} onChange={(event) => setNewProduct({ ...newProduct, name: event.target.value })} className="w-full bg-stone-50 border border-stone-200 p-3" />
          <textarea required rows={3} placeholder="Description" value={newProduct.description} onChange={(event) => setNewProduct({ ...newProduct, description: event.target.value })} className="w-full bg-stone-50 border border-stone-200 p-3" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-md:grid-cols-1">
            <select value={newProduct.category} onChange={(event) => setNewProduct({ ...newProduct, category: event.target.value })} className="bg-stone-50 border border-stone-200 p-3">
              {['Hoodies', 'T-Shirts', 'Jackets', 'Pants', 'Shirts', 'Accessories'].map((category) => <option key={category}>{category}</option>)}
            </select>
            <input required type="number" placeholder="Price" value={newProduct.price} onChange={(event) => setNewProduct({ ...newProduct, price: event.target.value })} className="bg-stone-50 border border-stone-200 p-3" />
            <input required type="number" placeholder="Stock" value={newProduct.stock} onChange={(event) => setNewProduct({ ...newProduct, stock: event.target.value })} className="bg-stone-50 border border-stone-200 p-3" />
            <input required placeholder="Sizes: S, M, L" value={newProduct.sizes} onChange={(event) => setNewProduct({ ...newProduct, sizes: event.target.value })} className="bg-stone-50 border border-stone-200 p-3" />
          </div>
          <input required type="url" placeholder="Image URL" value={newProduct.imageUrl} onChange={(event) => setNewProduct({ ...newProduct, imageUrl: event.target.value })} className="w-full bg-stone-50 border border-stone-200 p-3" />
          <button type="submit" className="bg-neutral-900 text-white px-5 py-3 text-xs uppercase tracking-wide rounded-md hover:bg-neutral-700">Create product</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <article key={product._id} className="admin-card border bg-white p-4 flex gap-4 rounded-xl">
            <img src={product.imageUrl} alt={product.name} className="w-20 h-24 object-cover object-top bg-stone-100 shrink-0" />
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wide text-stone-500">{product.category}</p>
              <h3 className="text-base font-semibold text-neutral-900 mt-1 truncate">{product.name}</h3>
              <p className="text-xs text-stone-600 mt-2">Rs. {product.price} / Stock: {product.stock}</p>
              <button type="button" onClick={() => handleDelete(product._id)} className="text-[10px] uppercase tracking-wide text-stone-500 mt-4 hover:text-red-700 hover:underline">Remove</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
