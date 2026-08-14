import React from 'react'

const Card = ({image, category, title, price}) => {
  return (
    <div className='inline-block cursor-pointer border border-gray-300 font-poppins
     rounded-[10px] shadow-[5px_5px_5px_rgba(0,0,0,0.2)] text-center  p-[10px] w-full'>
        <img
        src={image}
        alt={title}
        className='rounded-[10px]'
        ></img>
        <div className="text text-left pt-3 pl-2">
          <h1 className='font-semibold text-[12px] text-green-400 uppercase'>{category}</h1>
          <h2 className='font-bold text-xl'>{title}</h2>
          <p className='text-gray-500 font-semibold text-[20px]'>Rs. {price}</p>
        </div>
    </div>
  )
}

export default Card