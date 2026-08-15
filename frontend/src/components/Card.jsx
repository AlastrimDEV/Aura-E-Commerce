import React from 'react';

const Card = ({ image, category, title, price }) => {
  const displayPrice = typeof price === 'number' ? `Rs. ${price.toLocaleString()}` : (price?.toString().startsWith('Rs.') ? price : `Rs. ${price}`);

  return (
    <div className="group cursor-pointer flex flex-col w-full text-left">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-100 mb-4 rounded-sm">
        <img
          src={image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="flex flex-col space-y-1">
        <span className="text-[10px] tracking-wide uppercase text-neutral-400 font-medium">
          {category}
        </span>
        <h3 className="text-sm font-medium text-neutral-900 group-hover:text-black transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-neutral-600 font-normal">
          {displayPrice}
        </p>
      </div>
    </div>
  );
};

export default Card;