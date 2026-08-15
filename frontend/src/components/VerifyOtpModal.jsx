import React, { useState } from "react";
import { resendOtp, verifyOtp } from "../api/authApi";

const VerifyOtpModal = ({ email, onClose, onVerified }) => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp.trim()) {
      return alert("Please enter OTP");
    }

    try {
      setLoading(true);

      const response = await verifyOtp(email, otp);

      alert(response.message);

      onVerified();
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const response = await resendOtp(email);

      alert(response.message);
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Failed to resend OTP"
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-[200] px-4">
      <div className="bg-white w-full max-w-md p-8 shadow-xl relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-center">
          Verify Email
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-6">
          OTP sent to
          <br />
          <span className="font-medium text-black">
            {email}
          </span>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border p-4 outline-none text-center tracking-[0.5em]"
          maxLength={6}
        />

        <button
          onClick={handleVerify}
          disabled={loading}
          className="w-full bg-black text-white py-4 mt-4 uppercase text-xs font-semibold tracking-wide hover:bg-neutral-800 transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <button
          onClick={handleResend}
          className="w-full mt-4 text-sm text-gray-500 hover:text-black transition"
        >
          Resend OTP
        </button>

      </div>
    </div>
  );
};

export default VerifyOtpModal;