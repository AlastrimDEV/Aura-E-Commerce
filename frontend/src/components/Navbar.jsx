import React, { useEffect, useState } from 'react';
import BlackIcon from '../assets/iconblack.png';
import WhiteIcon from '../assets/iconwhite.png';
import { Handbag } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LoginModal from '../components/LoginModal';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === ("/");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navbarStyle =
  isHome && !scrolled
    ? 'bg-transparent text-white'
    : 'bg-white text-black shadow-sm';

  return (
    <>
    <div
      className={`
        fixed top-0 left-0 w-full z-50 transition-all duration-300
        ${navbarStyle}
      `}
    >
      <nav className="grid grid-cols-3 items-center px-8 py-5">
        {/* Left Menu */}
        <ul className="flex items-center gap-6">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/about-us">About Us</Link></li>
        </ul>

        {/* Logo */}
        <div className="mid flex justify-center">
        <Link to="/">
            <img src={isHome && !scrolled ? WhiteIcon : BlackIcon} alt="Logo" className="h-12" />
        </Link>
        </div>

        {/* Right Menu */}
        <ul className="flex justify-end gap-6">
          <li>
          <button onClick={() => setShowLogin(true)}>
            Login
          </button>
          </li>
          <li><Link to="/cart"><Handbag /></Link></li>
        </ul>
      </nav>
    </div>
    {showLogin && (
      <LoginModal
        onClose={() => setShowLogin(false)}
      />
    )}
    </>
  );
};

export default Navbar;