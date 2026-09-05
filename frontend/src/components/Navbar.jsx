import React, { useEffect, useState, useContext } from 'react';
import Logo from './Logo';
import { Handbag, User, LogOut, Package, Shield } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginModal from '../components/LoginModal';
import CartDrawer from '../components/CartDrawer';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const { totalCount, setIsCartOpen } = useContext(CartContext);

  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

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
      : 'bg-white/90 backdrop-blur-md text-black shadow-xs';

  return (
    <>
      <div
        className={`
          fixed top-0 left-0 w-full z-40 transition-all duration-300
          ${navbarStyle}
        `}
      >
        <nav className="site-nav grid grid-cols-3 items-center px-8 py-4">
          {/* Left Menu */}
          <ul className="site-nav-links flex items-center gap-8 text-xs uppercase tracking-wide font-medium">
            <li>
              <Link to="/" className="hover:opacity-75 transition-opacity">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:opacity-75 transition-opacity">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="hover:opacity-75 transition-opacity">
                About
              </Link>
            </li>
          </ul>

          {/* Logo */}
          <div className="site-nav-logo mid flex justify-center">
            <Link to="/" aria-label="Aura Home">
              <Logo isLight={isHome && !scrolled} />
            </Link>
          </div>

          {/* Right Menu */}
          <div className="site-nav-actions flex justify-end items-center gap-6 text-xs uppercase tracking-wide">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 font-medium hover:opacity-75 transition-opacity py-2"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden md:inline">{user.name}</span>
                </button>

                {userDropdown && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white text-neutral-900 rounded-xs shadow-xl border border-neutral-100 py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdown(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100 text-xs">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-[10px] text-stone-400 lowercase">{user.email}</p>
                    </div>

                    <Link
                      to="/orders"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-xs text-neutral-700 hover:bg-stone-50 transition-colors"
                    >
                      <Package className="w-4 h-4 text-neutral-500" />
                      <span>My Orders</span>
                    </Link>

                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-xs text-neutral-700 hover:bg-stone-50 transition-colors"
                      >
                        <Shield className="w-4 h-4 text-amber-600" />
                        <span>Admin Panel</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setUserDropdown(false);
                        logout();
                        navigate('/');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors text-left border-t border-stone-100"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="font-medium hover:opacity-75 transition-opacity"
              >
                <span className="site-nav-sign-in-label">Sign In</span>
              </button>
            )}

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1 hover:opacity-75 transition-opacity"
              aria-label="Shopping Bag"
            >
              <Handbag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-black text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </nav>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <CartDrawer />
    </>
  );
};

export default Navbar;