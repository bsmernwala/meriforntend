//Updated At 6/11/25

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductList from "../productviews/ProductList";
import BillByID from "./BillByID";
import EditCustomerProfile from "./EditCustomerProfile";
import Customer_Change_Pass from "./Customer_Change_Pass";
import OrderTracking from "./OrderTracking";
import "../index.css";
import PaymentHistory from "./PaymentHistory";

function CustomerHome() {
  const [user, setUser] = useState(null);
  const [isshowplist, setIsShowPList] = useState(true);
  const [isshowbill, setIsShowBill] = useState(false);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isChangePass, setIsChangePass] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isshowordertracking, setIsShowOrderTracking] = useState(false);
  const[showPaymentHistory,setshowPaymentHistory]=useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const localData = localStorage.getItem("userSession");
    const sessionData = sessionStorage.getItem("userSession");
    const userData = localData || sessionData;

    if (!userData) {
      alert("Session expired. Please log in again.");
      navigate("/customermain/customerlogin");
    } else {
      setUser(JSON.parse(userData));
      //alert("custtt"+user.Cid)
    }
  }, [navigate]);

  useEffect(() => {
    
    const handleScroll = () => setIsShrunk(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userSession");
      sessionStorage.removeItem("userSession");
      localStorage.removeItem("customertoken");
      navigate("/customermain/customerlogin");
    }
  };

  if (!user) return null;

  const imageUrl = user.cpicname || user.CPicName;

  return (
    <div
      style={{
        backgroundColor: "#0b1020",
        color: "#e8ebff",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* ==== HEADER BAR ==== */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isShrunk ? "8px 20px" : "20px 35px",
          backgroundColor: "#121836",
          borderBottom: "1px solid rgba(91,209,255,0.3)",
          transition: "all 0.3s ease",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          flexWrap: "wrap",
        }}
      >
        {/* === Customer Info === */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={imageUrl || "/default-avatar.png"}
            alt="Customer"
            height={isShrunk ? 50 : 70}
            width={isShrunk ? 50 : 70}
            style={{
              borderRadius: "50%",
              border: "3px solid #5bd1ff",
              objectFit: "cover",
              transition: "0.3s",
            }}
            onError={(e) => (e.target.src = "/default-avatar.png")}
          />

          <div>
            <h2
              style={{
                margin: 0,
                fontSize: isShrunk ? "18px" : "22px",
                fontWeight: "600",
                color: "#5bd1ff",
                transition: "0.3s",
              }}
            >
              Welcome, {user.cfname}
            </h2>
            {!isShrunk && (
              <p style={{ margin: 0, color: "#cdd5f0", fontSize: "14px" }}>
                🛍️ Customer Dashboard
              </p>
            )}
          </div>
        </div>

        {/* === Action Buttons === */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "flex-end",
            gap: "12px",
          }}
        >
          <button
            onClick={() => {
              setIsEditProfile((prev) => !prev);
              setIsChangePass(false);
              setIsShowBill(false);
            }}
            style={getButtonStyle("#3b82f6", isEditProfile)}
          >
            {isEditProfile ? "Close Edit" : "Edit Profile"}
          </button>

          <button
            onClick={() => {
              setIsChangePass((prev) => !prev);
              setIsEditProfile(false);
            }}
            style={getButtonStyle("#06b6d4", isChangePass)}
          >
            {isChangePass ? "Close Password" : "Change Password"}
          </button>

          <button
            onClick={() => {
              setIsShowPList((prev) => !prev);
              setIsShowBill(false);
              setIsEditProfile(false);
            }}
            style={getButtonStyle("#10b981", isshowplist)}
          >
            {isshowplist ? "Close Shopping" : "Shopping"}
          </button>

          <button
            onClick={() => {
              setIsShowBill((prev) => !prev);
              setIsShowPList(false);
              setIsEditProfile(false);
            }}
            style={getButtonStyle("#8b5cf6", isshowbill)}
          >
            {isshowbill ? "Close Orders" : "View Orders"}
          </button>

             <button
            onClick={() => {
              setIsShowOrderTracking((prev) => !prev);
              setIsShowPList(false);
              setIsEditProfile(false);
                         }}
            style={getButtonStyle("#3b82f6", isEditProfile)}
          >
            {isshowordertracking ? "Close Order Tracking" : "Order Tracking"}
          </button>

         <button
            onClick={() => {
              setshowPaymentHistory((prev) => !prev);
              setIsShowPList(false);
              setIsEditProfile(false);
              setIsShowOrderTracking(false);
            }}
            style={getButtonStyle("#323039ff", showPaymentHistory)}
          >
            {showPaymentHistory ? "Close Payment History" : "View Payment History"}
          </button>

          <button
            onClick={handleLogout}
            style={getButtonStyle("#dc2626")}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ==== MAIN CONTENT ==== */}
      <main
        style={{
          padding: "30px 40px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {isshowplist && (
          <div style={cardStyle}>
            <ProductList data={user.Cid} />
          </div>
        )}

        {isshowbill && (
          <div style={cardStyle}>
            <BillByID data={user.Cid} />
          </div>
        )}

        {isEditProfile && (
          <div style={cardStyle}>
            <EditCustomerProfile
              user={user}
              onClose={() => setIsEditProfile(false)}
              onUpdate={(updatedUser) => {
                const updated = {
                  cfname: updatedUser.CustomerName,
                  cpicname: updatedUser.CPicName,
                  Cid: updatedUser.Cid,
                };
                setUser(updated);
                if (localStorage.getItem("userSession")) {
                  localStorage.setItem("userSession", JSON.stringify(updated));
                } else {
                  sessionStorage.setItem(
                    "userSession",
                    JSON.stringify(updated)
                  );
                }
              }}
            />
          </div>
        )}

        {isChangePass && (
          <div style={cardStyle}>
            <Customer_Change_Pass
              CUserId={user.Cid || user.CUserId}
              onClose={() => setIsChangePass(false)}
            />
          </div>
        )}
        {isshowordertracking && (
          <div style={cardStyle}>
            <OrderTracking
              CUserId={user.Cid || user.CUserId}
              onClose={() => setIsShowOrderTracking(false)}
            />
          </div>
        )}
         {showPaymentHistory && (
          <div style={cardStyle}>
            <PaymentHistory
              cid={user.Cid || user.CUserId}
              onClose={() => setshowPaymentHistory(false)}
            />
          </div>
        )}
      </main>

      {/* ==== FOOTER ==== */}
      <footer
        style={{
          textAlign: "center",
          padding: "15px",
          marginTop: "40px",
          color: "#5bd1ff",
          fontSize: "14px",
          borderTop: "1px solid rgba(91,209,255,0.3)",
          backgroundColor: "#121836",
        }}
      >
        <marquee scrollamount="5">
          🌐 www.sabkuchmiltahai.com — All Rights Reserved © {new Date().getFullYear()}
        </marquee>
      </footer>
    </div>
  );
}

/* === Shared Button Style Function === */
const getButtonStyle = (bgColor, active = false) => ({
  backgroundColor: bgColor,
  border: active ? "2px solid #5bd1ff" : "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "8px",
  fontWeight: "500",
  letterSpacing: "0.3px",
  cursor: "pointer",
  transition: "0.3s ease",
  boxShadow: active
    ? "0 0 10px rgba(91,209,255,0.6)"
    : "0 0 8px rgba(0,0,0,0.3)",
});

/* === Shared Card Style for content boxes === */
const cardStyle = {
  backgroundColor: "#121a3a",
  borderRadius: "12px",
  padding: "25px",
  marginTop: "20px",
  boxShadow: "0 0 25px rgba(91,209,255,0.1)",
};

export default CustomerHome;
