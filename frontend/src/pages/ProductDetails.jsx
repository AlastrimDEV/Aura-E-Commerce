import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById, getProducts } from '../api/productApi';
import Card from '../components/Card';

const ProductDetails = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);

        const allProducts = await getProducts();

        const related = allProducts
          .filter(
            (item) =>
              item.category === data.category &&
              item._id !== data._id
          )
          .slice(0, 4);

        setRelatedProducts(related);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="pt-28">

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-8">

        <div className="grid lg:grid-cols-2 gap-16">

          {/* Image */}
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-[800px] object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">

            <p className="uppercase tracking-[0.25em] text-gray-500 text-sm">
              {product.category}
            </p>

            <h1 className="text-5xl font-medium mt-4">
              {product.name}
            </h1>

            <p className="text-2xl mt-6">
              Rs. {product.price}
            </p>

            <div className="mt-10 border-t pt-8">
              <p className="text-gray-600 leading-8">
                {product.description}
              </p>
            </div>

            {/* Size Selection */}
            <div className="mt-10">

              <p className="uppercase text-sm tracking-wider mb-4">
                Select Size
              </p>

              <div className="flex gap-3">

                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() =>
                      setSelectedSize(size)
                    }
                    className={`w-14 h-14 border transition ${
                      selectedSize === size
                        ? 'bg-black text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {size}
                  </button>
                ))}

              </div>

            </div>

            {/* Add To Bag */}
            <button
              className="
                mt-12
                bg-black
                text-white
                py-5
                uppercase
                tracking-[0.25em]
                hover:bg-gray-800
                transition
              "
            >
              Add To Bag
            </button>

          </div>

        </div>

      </section>

      {/* Related Products */}
      <section className="max-w-7xl mx-auto px-8 mt-32 mb-20">

        <h2 className="text-3xl font-medium mb-10">
          You May Also Like
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {relatedProducts.map((item) => (
            <Card
              key={item._id}
              image={item.imageUrl}
              category={item.category}
              title={item.name}
              price={`Rs. ${item.price}`}
            />
          ))}

        </div>

      </section>

    </div>
  );
};

export default ProductDetails;