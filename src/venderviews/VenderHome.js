//update 5/11/25

import React, { useState, useEffect } from "react";
import EditVenderProfile from "./EditVenderProfile";
import Product from "../productviews/Product";
import VendorSales from "./VendorSales";
import Vender_Change_Pass from "./Vender_Change_Pass";
import UpdateOrderStatus from "../adminviews/UpdateOrderStatus";

function VenderHome({ vender, onLogout }) {
  const [editing, setEditing] = useState(false);
  const [venderData, setVenderData] = useState(vender);
  const [isshowproduct, setIsShowProduct] = useState(false);
  const [isShrunk, setIsShrunk] = useState(false);
  const [isshowvendorsales, setIsShowVendorSales] = useState(false);
  const [isChangePass, setIsChangePass] = useState(false);
const [isupdateordershow, setIsUpdateOrderShow] = useState(false);

  // Handle scroll shrink effect
  useEffect(() => {
    const handleScroll = () => setIsShrunk(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#0b1020",
        color: "#e8ebff",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* ==== STICKY HEADER ==== */}
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
        }}
      >
        {/* === Vendor Info === */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <img
            src={
              venderData?.VPicName
                ? venderData.VPicName
                : "/default-avatar.png"
            }
            alt="Vendor"
            style={{
              width: isShrunk ? "60px" : "90px",
              height: isShrunk ? "60px" : "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "3px solid #5bd1ff",
              transition: "all 0.3s ease",
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
              {venderData.VenderName}
            </h2>

            {!isShrunk && (
              <div style={{ fontSize: "14px", color: "#cdd5f0" }}>
                <p style={{ margin: 0 }}>📧 {venderData.VEmail}</p>
                <p style={{ margin: 0 }}>📞 {venderData.VContact}</p>
              </div>
            )}
          </div>
        </div>

        {/* === Action Buttons === */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={() => {
              setEditing((prev) => !prev);
              setIsShowProduct(false);
              setIsShowVendorSales(false);
            }}
            style={getButtonStyle("#3b82f6")}
          >
            {editing ? "Close Edit" : "Edit Profile"}
          </button>

            <button
            onClick={() => {
              setIsChangePass((prev) => !prev);
              //setIsEditProfile(false);
            }}
            style={getButtonStyle("#06b6d4", isChangePass)}
          >
            {isChangePass ? "Close Password" : "Change Password"}
          </button>

          <button
            onClick={() => {
              setIsShowProduct((prev) => !prev);
              setEditing(false);
              setIsShowVendorSales(false);
            }}
            style={getButtonStyle("#10b981")}
          >
            {isshowproduct ? "Close Product" : "Manage Product"}
          </button>

          <button
            onClick={() => {
              setIsShowVendorSales((prev) => !prev);
              setEditing(false);
              setIsShowProduct(false);
            }}
            style={getButtonStyle("#06b6d4")}
          >
            {isshowvendorsales ? "Close Sales" : "View Sales"}
          </button>

          <button
            onClick={() => {
              setIsUpdateOrderShow((prev) => !prev);
              setEditing(false);
              setIsShowVendorSales(false);
              setIsShowProduct(false);
            }}
            style={getButtonStyle("#10b981")}
          >
            {isupdateordershow ? "Close Update Order Status" : "Update Order Status"}
          </button>

          <button
            onClick={() => {
              localStorage.removeItem("venderSession");
              onLogout();
            }}
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
        {editing && (
          <div
            style={{
              backgroundColor: "#121a3a",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 0 25px rgba(91,209,255,0.1)",
            }}
          >
            <div style={cardStyle}>
            <EditVenderProfile
              vender={venderData}
              onClose={() => setEditing(false)}
              onUpdate={(updated) => setVenderData(updated)}
            />
          </div>
          </div>
        )}

        {isshowproduct && (
          
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "#121a3a",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 0 25px rgba(91,209,255,0.1)",
            }}
          >
            <Product data={vender.Vid} />
          </div>
        )}

        {isshowvendorsales && (
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "#121a3a",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 0 25px rgba(91,209,255,0.1)",
            }}
          >
            <VendorSales vender={vender} />
          </div>
        )}
        {isChangePass && (
                  <div style={cardStyle}>
                    <Vender_Change_Pass
                      CUserId={vender.Vid || vender.VUserId}
                      onClose={() => setIsChangePass(false)}
                    />
                  </div>
                )}

         {isupdateordershow && (
          <div
            style={{
              marginTop: "20px",
              backgroundColor: "#121a3a",
              borderRadius: "12px",
              padding: "25px",
              boxShadow: "0 0 25px rgba(91,209,255,0.1)",
            }}
          >
            <UpdateOrderStatus updatedByName={"Vender"} />
          </div>
        )}
      </main>
    </div>
  );
}

/* === Shared Button Styling === */
const getButtonStyle = (bgColor) => ({
  backgroundColor: bgColor,
  border: "none",
  color: "white",
  padding: "10px 16px",
  borderRadius: "8px",
  fontWeight: "500",
  letterSpacing: "0.3px",
  cursor: "pointer",
  transition: "0.3s ease",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
});

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
export default VenderHome;
