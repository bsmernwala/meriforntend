
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Vender_Change_Pass.css";

export default function Vender_Change_Pass() {
  const [VUserId, setVUserId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  // Auto-clear messages after 4s
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  // Password strength evaluation
  function passwordStrength(pw) {
    if (!pw) return { label: "", score: 0 };
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const labels = ["Very Weak", "Weak", "Good", "Strong"];
    return { label: labels[score - 1] || "", score };
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!VUserId || !oldPassword || !newPassword || !confirmPassword) {
      setError("Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${REACT_APP_BASE_API_URL}/vender/changepassword`, {
        VUserId,
        OldPassword: oldPassword,
        NewPassword: newPassword,
      });

      setMessage(res.data?.message || "Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Failed to change password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(newPassword);

  return (
    <div className="changepass-container">
      <div className="changepass-card">
        <h2>Change Password</h2>

        {message && <div className="alert success">{message}</div>}
        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* USER ID */}
          <label>User ID</label>
          <input
            type="text"
            value={VUserId}
            onChange={(e) => setVUserId(e.target.value)}
            placeholder="Enter your User ID"
          />

          {/* OLD PASSWORD */}
          <label>Old Password</label>
          <div className="password-field">
            <input
              type={showPassword.old ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />
            <span onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}>
              {showPassword.old ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* NEW PASSWORD */}
          <label>New Password</label>
          <div className="password-field">
            <input
              type={showPassword.new ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
            <span onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}>
              {showPassword.new ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {/* PASSWORD STRENGTH BAR */}
          {strength.label && (
            <div className="strength-bar">
              <div className={`bar level-${strength.score}`}></div>
              <span>{strength.label}</span>
            </div>
          )}

          {/* CONFIRM PASSWORD */}
          <label>Confirm New Password</label>
          <div className="password-field">
            <input
              type={showPassword.confirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />
            <span
              onClick={() =>
                setShowPassword({ ...showPassword, confirm: !showPassword.confirm })
              }
            >
              {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Change Password"}
          </button>
        </form>

        <p className="hint">
          💡 Tip: Use a strong password (8+ chars, uppercase, numbers, symbols).
        </p>
      </div>
    </div>
  );
}
