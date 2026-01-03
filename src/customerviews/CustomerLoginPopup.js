

import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import "../customerviews/CustomerLoginPopup.css";

function CustomerLoginPopup({ onClose, onLoginSuccess }) {
  const [uid, setUId] = useState("");
  const [upass, setUPass] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  useEffect(() => {
    const myCookies = Cookies.get("auth");
    if (myCookies) {
      const obj = JSON.parse(myCookies);
      setUId(obj.username);
      setUPass(obj.password);
    }
  }, []);

  const handleLoginButton = async () => {
    setAuthError("");
    setLoading(true);

    try {
      const res = await axios.post(`${REACT_APP_BASE_API_URL}/customer/login`, {
        CUserId: uid,
        CUserPass: upass,
      });

      if (res.data.CUserId) {
        if (res.data.Status === "Inactive") {
          alert("User not active. Please wait for admin activation.");
          setLoading(false);
          return;
        }

        if (isChecked) {
          Cookies.set(
            "auth",
            JSON.stringify({ username: uid, password: upass }),
            { expires: 7 }
          );
        }

        const sessionData = {
          cfname: res.data.CustomerName,
          cpicname: res.data.CPicName,
          cid: res.data.Cid,
        };

        if (isChecked) {
          localStorage.setItem("userSession", JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem("userSession", JSON.stringify(sessionData));
        }

        onLoginSuccess(sessionData);
        onClose();
      } else {
        setAuthError("Authentication failed: Invalid ID or Password");
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setAuthError("Authentication failed: Invalid ID or Password");
      } else {
        setAuthError("Login failed: " + (err.response?.data?.message || err.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup-overlay">
      <div className="login-popup-container">
        <span className="login-popup-close" onClick={onClose}>
          ✖
        </span>

        <h4>Customer Login</h4>

        <input
          type="text"
          placeholder="User Id"
          value={uid}
          onChange={(e) => setUId(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={upass}
          onChange={(e) => setUPass(e.target.value)}
        />

        <div className="remember-me">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <span>Remember Me</span>
        </div>

        {authError && <p className="error">{authError}</p>}

        <button
          onClick={handleLoginButton}
          disabled={loading}
          style={{ position: "relative", paddingLeft: loading ? "35px" : "12px" }}
        >
          {loading && (
            <span
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "16px",
                height: "16px",
                border: "2px solid #fff",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
          )}
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>

      {/* Spinner animation */}
      <style>{`
        @keyframes spin {
          0% { transform: translateY(-50%) rotate(0deg); }
          100% { transform: translateY(-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default CustomerLoginPopup;
