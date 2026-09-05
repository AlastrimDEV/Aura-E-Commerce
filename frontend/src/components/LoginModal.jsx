import React, { useContext, useState } from 'react';
import { loginUser, registerUser } from '../api/authApi';
import VerifyOtpModal from './VerifyOtpModal';
import { AuthContext } from '../context/AuthContext';
import Logo from './Logo';

const LoginModal = ({ onClose }) => {
    
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async () => {
    try {
      await registerUser(formData);

      setRegisteredEmail(formData.email);
      setShowOtpModal(true);

    } catch (error) {
      alert(
        error.response?.data?.message ||
        'Registration failed'
      );
    }
  };

  const handleLogin = async() => {
    try {
        const data = await loginUser({
            email: formData.email,
            password: formData.password
          });
      
          login(data);
      
          onClose();

    } catch (error) {
        alert(
          error.response?.data?.message ||
          "Login failed"
        );
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
        await handleLogin();
      } else {
        await handleRegister();
      }

    
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] px-4">

        <div className="bg-white w-full max-w-md p-10 shadow-xl relative rounded-xs">

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-2xl text-neutral-400 hover:text-neutral-900"
          >
            ×
          </button>

          <div className="flex justify-center mb-3">
            <Logo className="h-8" />
          </div>

          <p className="text-center text-gray-500 mb-8 text-sm">
            {isLogin
              ? 'Welcome back'
              : 'Create your account'}
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-stone-200 p-4 outline-none text-sm focus:border-black"
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-stone-200 p-4 outline-none text-sm focus:border-black"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-stone-200 p-4 outline-none text-sm focus:border-black"
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-4 uppercase text-xs font-semibold tracking-wide hover:bg-neutral-800 transition"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-500 hover:text-black"
            >
              {isLogin
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Login'}
            </button>
          </div>

        </div>
      </div>

      {showOtpModal && (
        <VerifyOtpModal
          email={registeredEmail}
          onClose={() => setShowOtpModal(false)}
          onVerified={() => {
            setShowOtpModal(false);

            setIsLogin(true);

            setFormData({
              name: '',
              email: registeredEmail,
              password: '',
            });
          }}
        />
      )}
    </>
  );
};

export default LoginModal;