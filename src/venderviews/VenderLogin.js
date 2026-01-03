
import React, { useState, useEffect } from "react";
import axios from "axios";
import VenderForgotPassword from "./VenderForgotPassword";
import VenderHome from "./VenderHome";
import "./VenderLogin.css"; // make sure to import the CSS file
import { FaEye, FaEyeSlash } from "react-icons/fa";
function VenderLogin() {
  const [vuid, setVuid] = useState("");
  const [vupass, setVupass] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [vender, setVender] = useState(null);
  const [showForgot, setShowForgot] = useState(false);
 const [showPassword, setShowPassword] = useState(false);
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  // --- Load session if exists ---
  useEffect(() => {
    const savedSession = localStorage.getItem("venderSession");
    if (savedSession) {
      setVender(JSON.parse(savedSession));
    }
    const savedUid = localStorage.getItem("venderUID");
    const savedPass = localStorage.getItem("venderUPass");
    if (savedUid && savedPass) {
      setVuid(savedUid);
      setVupass(savedPass);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${REACT_APP_BASE_API_URL}/vender/login`, {
        vuid,
        vupass,
      });

      if (res.data && res.data.VUserId) {
        if (res.data.Status === "Inactive") {
            alert("User not active. Please wait for admin activation.");
            return;
          }
        setVender(res.data);
        localStorage.setItem("venderSession", JSON.stringify(res.data));

        if (rememberMe) {
          localStorage.setItem("venderUID", vuid);
          localStorage.setItem("venderUPass", vupass);
        } else {
          localStorage.removeItem("venderUID");
          localStorage.removeItem("venderUPass");
        }
      } else {
        alert("Invalid login");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const handleLogout = () => {
    setVender(null);
    localStorage.removeItem("venderSession");
  };

  if (showForgot) {
    return <VenderForgotPassword onBack={() => setShowForgot(false)} />;
  }

  if (vender) {
    return <VenderHome vender={vender} onLogout={handleLogout} />;
  }

  return (
    <div style={cardStyle}>
    {/* <div className="venderlogin-container">
      <div className="venderlogin-form"> */}
        <h4>Vendor Login</h4>

        <input
          type="text"
          placeholder="Vendor User ID"
          value={vuid}
          onChange={(e) => setVuid(e.target.value)}
        />

        {/* <input
          type="password"
          placeholder="Password"
          value={vupass}
          onChange={(e) => setVupass(e.target.value)}
        /> */}
         <div className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={vupass}
                  onChange={(e) => setVupass(e.target.value)}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
        

        <div className="remember-me">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label>Remember Me</label>
        </div>

        <button className="venderlogin-button" onClick={handleLogin}>
          Login
        </button>

        <button
          className="venderlogin-button"
          style={{ backgroundColor: "#555", marginTop: "10px" }}
          onClick={() => setShowForgot(true)}
        >
          Forgot Password?
        </button>
      {/* </div>
    </div> */}
    </div>
  );
}
const cardStyle = {
  backgroundColor: "#121a3a",
  borderRadius: "12px",
  padding: "25px",
  marginTop: "20px",
  boxShadow: "0 0 25px rgba(91,209,255,0.1)",
  
  width: "100%",
  maxWidth: "600px",
  height: "auto",
  minHeight: "200px",
  boxSizing: "border-box",

  // ✅ Center horizontally
  marginLeft: "auto",
  marginRight: "auto",
};

export default VenderLogin;
