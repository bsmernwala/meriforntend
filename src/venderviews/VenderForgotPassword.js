
import React, { useState } from "react";
import axios from "axios";

function VenderForgotPassword({ onBack }) {
  const [VUserId, setVUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  const sendOtp = async () => {
    try {
      const res = await axios.post(`${REACT_APP_BASE_API_URL}/vender/send-otp`, {
        VUserId,
      });
      alert(res.data.message);
      if (res.data.success) setStep(2);
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    }
  };

  const resetPassword = async () => {
    try {
      const res = await axios.post(
        `${REACT_APP_BASE_API_URL}/vender/reset-password`,
        {
          VUserId,
          otp,
          newPassword,
        }
      );
      alert(res.data.message);
      if (res.data.success) onBack();
    } catch (err) {
      console.error(err);
      alert("Error resetting password");
    }
  };

  return (
    <div style={{ margin: 20 }}>
      <h3>Vendor Forgot Password</h3>
      {step === 1 && (
        <>
          <input
            type="text"
            placeholder="Enter Vendor User ID"
            value={VUserId}
            onChange={(e) => setVUserId(e.target.value)}
          />
          <br />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <br />
          <button onClick={resetPassword}>Reset Password</button>
        </>
      )}

      <br />
      <button onClick={onBack}>Back to Login</button>
    </div>
  );
}

export default VenderForgotPassword;
