// export default CustomerLogin;
//[30/10/25 update]
import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./CustomerLogin.css";


function CustomerLogin() {
  const [uid, setUId] = useState("");
  const [upass, setUPass] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState(""); // New state for auth errors
  const [showPassword, setShowPassword] = useState(false);
  // Forgot password states
  const [showForgot, setShowForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1=Enter ID, 2=OTP + new pass
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const myCookies = Cookies.get("auth");
    if (myCookies) {
      const obj = JSON.parse(myCookies);
      setUId(obj.username);
      setUPass(obj.password);
    }
  }, []);

  const validateForm = () => {
    let temp = {};
    let valid = true;

    if (!uid || uid.length < 4) {
      temp.cuserid = "User ID must be at least 4 characters";
      valid = false;
    }
    if (!upass || upass.length < 3) {
      temp.cuserpass = "Password must be at least 3 characters";
      valid = false;
    }
    setErrors(temp);
    return valid;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setAuthError(""); // Reset previous auth errors

    axios
      .post("http://localhost:9191/customer/login", {
        CUserId: uid,
        CUserPass: upass,
      })
      .then((res) => {
        if (res.data.CUserId) {
          if (res.data.Status === "Inactive") {
            alert("User not active. Please wait for admin activation.");
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
            Cid: res.data.Cid,
          };

          if (isChecked) {
            localStorage.setItem("userSession", JSON.stringify(sessionData));
          } else {
            sessionStorage.setItem("userSession", JSON.stringify(sessionData));
          }

          localStorage.setItem("customertoken", "sometoken456");
          navigate("/customermain/customerhome");
        } else {
          setAuthError("Authentication failed: Invalid ID or Password");
        }
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            setAuthError("Authentication failed: Invalid ID or Password");
          } else {
            setAuthError("Server error: " + err.response.data.message || err.message);
          }
        } else {
          setAuthError("Server error: " + err.message);
        }
      });
  };

  // Step 1: Send OTP
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotMessage("Please enter your Customer ID.");
      return;
    }

    axios
      .post("http://localhost:9191/customer/forgotpassword/send-otp", {
        CUserId: forgotEmail,
      })
      .then((res) => {
        setForgotMessage(res.data.message || "OTP sent to your email.");
        setForgotStep(2);
      })
      .catch((err) => setForgotMessage("Error: " + err.message));
  };

  // Step 2: Verify OTP & Reset Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!otp || !newPassword) {
      setForgotMessage("Please enter OTP and new password.");
      return;
    }

    axios
      .post("http://localhost:9191/customer/forgotpassword/verify-otp", {
        CUserId: forgotEmail,
        OTP: otp,
        NewPassword: newPassword,
      })
      .then((res) => {
        setForgotMessage(res.data.message || "Password reset successfully!");
        setForgotStep(1);
        setShowForgot(false);
        setOtp("");
        setNewPassword("");
      })
      .catch((err) => setForgotMessage("Error: " + err.message));
  };

  return (
    <div className="customerlogin-container">
      <div className="customerlogin-form">
        {!showForgot ? (
          <>
            <h4>Customer Login</h4>
            <input
              type="text"
              placeholder="Customer ID"
              value={uid}
              onChange={(e) => setUId(e.target.value)}
            />
            <span className="error">{errors.cuserid}</span>

            {/* <input
              type="password"
              placeholder="Password"
              value={upass}
              onChange={(e) => setUPass(e.target.value)}
            /> */}
            <div className="password-field">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={upass}
          onChange={(e) => setUPass(e.target.value)}
        />
        <span
          className="eye-icon"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
      </div>
            <span className="error">{errors.cuserpass}</span>

            {authError && <p className="error">{authError}</p>}

            <div className="remember-me">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              <span>Remember Me</span>
            </div>

            <button className="customerlogin-button" onClick={handleLogin}>
              Login
            </button>

            <p
              className="forgot-password-link"
              onClick={() => setShowForgot(true)}
            >
              Forgot Password?
            </p>
          </>
        ) : (
          <>
            <h4>Forgot Password</h4>
            {forgotStep === 1 ? (
              <>
                <input
                  type="text"
                  placeholder="Enter Customer ID"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <button className="customerlogin-button" onClick={handleSendOtp}>
                  Send OTP
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Enter New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button className="customerlogin-button" onClick={handleResetPassword}>
                  Reset Password
                </button>
              </>
            )}
            {forgotMessage && <p style={{ color: "green" }}>{forgotMessage}</p>}
            <p
              className="forgot-password-link"
              onClick={() => {
                setShowForgot(false);
                setForgotStep(1);
                setForgotMessage("");
                setOtp("");
                setNewPassword("");
              }}
            >
              Back to Login
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default CustomerLogin;
