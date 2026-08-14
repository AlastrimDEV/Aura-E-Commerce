import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t mt-24">
      <div className="max-w-7xl mx-auto px-8 py-16">

        {/* Top */}
        <div className="grid md:grid-cols-4 gap-12">

          {/* Brand */}
          <div>
            <h2 className="text-2xl font-bold tracking-widest">
              STITCH
            </h2>

            <p className="text-gray-500 mt-4 text-sm leading-7">
              Minimal fashion for everyday life.
              Designed with simplicity and timeless style.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold uppercase tracking-wider mb-4">
              Shop
            </h3>

            <ul className="space-y-3 text-gray-600">
              <li><Link to="/shop">All Products</Link></li>
              <li><Link to="/shop">Men</Link></li>
              <li><Link to="/shop">Women</Link></li>
              <li><Link to="/shop">New Arrivals</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold uppercase tracking-wider mb-4">
              Company
            </h3>

            <ul className="space-y-3 text-gray-600">
              <li><Link to="/about-us">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold uppercase tracking-wider mb-4">
              Newsletter
            </h3>

            <p className="text-gray-500 text-sm mb-4">
              Get updates on new collections and exclusive offers.
            </p>

            <div className="flex border">
              <input
                type="email"
                placeholder="Email address"
                className="flex-1 px-4 py-3 outline-none"
              />

              <button className="px-5 border-l hover:bg-black hover:text-white transition">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 STITCH. All rights reserved.</p>

          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#">Instagram</a>
            <a href="#">Facebook</a>
            <a href="#">TikTok</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;