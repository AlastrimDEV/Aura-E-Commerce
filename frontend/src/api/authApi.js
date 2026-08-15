import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

export const registerUser = async(userData) => {
    const response = await axios.post(
        `${API_URL}/register`, userData
    );
    return response.data;
}

export const verifyOtp = async(email, otp)=>{
    const response = await axios.post(
        `${API_URL}/verify-otp`, {email, otp}
    )
    return response.data
}

export const resendOtp = async (email) => {
    const response = await axios.post(
      `${API_URL}/resend-otp`,
      { email }
    );
  
    return response.data;
  };

export const loginUser = async(userData)=>{
    const response = await axios.post(
        `${API_URL}/login`, userData
    )
    return response.data;
}