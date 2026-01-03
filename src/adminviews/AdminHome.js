//update 5/11/25
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StateMgt from "./StateMgt";
import CityMgt from "./CityMgt";
import ProductCatgMgt from "./ProductCatgMgt";
import VenderMgt from "./VenderMgt";
import ShowBills from "./ShowBills";
import ProductList from "./ProductList";
import CustomerMgt from "./CustomerMgt";
import AdminDashboard from "./AdminDashboard";
import UpdateOrderStatus from "./UpdateOrderStatus";
import "../index.css";

function AdminHome() {
  const [isstateshow, setIsStateShow] = useState(false);
  const [iscityshow, setIsCityShow] = useState(false);
  const [ispcatgshow, setIsPCatgShow] = useState(false);
  const [isvendershow, setIsVenderShow] = useState(false);
  const [isbillshow, setIsBillShow] = useState(false);
  const [isproductlistshow, setIsProductListShow] = useState(false);
  const [iscustomershow, setIsCustomerShow] = useState(false);
  const [isdashboardshow, setIsDashboardShow] = useState(false);
  const [isupdateordershow, setIsUpdateOrderShow] = useState(false);
  const navigate = useNavigate();

  function LogOutButtonClick() {
    localStorage.removeItem("admintoken");
    navigate("/adminmain/adminlogin");
  }

  function hideAll() {
    setIsStateShow(false);
    setIsCityShow(false);
    setIsPCatgShow(false);
    setIsVenderShow(false);
    setIsBillShow(false);
    setIsProductListShow(false);
    setIsCustomerShow(false);
    setIsDashboardShow(false);
    setIsUpdateOrderShow(false);
  }

  return (
    <div
      style={{
        backgroundColor: "#0b1020",
        color: "#e8ebff",
        minHeight: "100vh",
        padding: "30px 20px",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <center>
        <h2
          style={{
            color: "#5bd1ff",
            marginBottom: "30px",
            letterSpacing: "1px",
            fontWeight: "600",
            textShadow: "0 0 5px rgba(91,209,255,0.6)",
          }}
        >
          ⚙️ Admin Control Panel
        </h2>

        {/* ==== NAVIGATION SECTION ==== */}
        <div
          style={{
            backgroundColor: "#111835",
            padding: "20px 25px",
            borderRadius: "16px",
            boxShadow: "0 0 20px rgba(91,209,255,0.25)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "12px",
            maxWidth: "900px",
          }}
        >
          {[
            { label: "📊 Analytics", color: "#4f46e5", func: () => setIsDashboardShow(!isdashboardshow) },
            { label: "🗺️ State", color: "#10b981", func: () => setIsStateShow(!isstateshow) },
            { label: "🏙️ City", color: "#3b82f6", func: () => setIsCityShow(!iscityshow) },
            { label: "🛒 Product Category", color: "#22c55e", func: () => setIsPCatgShow(!ispcatgshow) },
            { label: "🧑‍💼 Vendor", color: "#06b6d4", func: () => setIsVenderShow(!isvendershow) },
            { label: "🧾 Bills", color: "#8b5cf6", func: () => setIsBillShow(!isbillshow) },
            { label: "📦 Products", color: "#334155", func: () => setIsProductListShow(!isproductlistshow) },
            { label: "👥 Customers", color: "#64748b", func: () => setIsCustomerShow(!iscustomershow) },
            { label: "👥 Update Order Status", color: "#64748b", func: () => setIsUpdateOrderShow(!isupdateordershow) },
          ].map((btn, idx) => (
            <button
              key={idx}
              onClick={() => {
                hideAll();
                btn.func();
              }}
              style={{
                backgroundColor: btn.color,
                border: "none",
                color: "white",
                padding: "10px 18px",
                borderRadius: "8px",
                fontWeight: "500",
                letterSpacing: "0.3px",
                cursor: "pointer",
                transition: "0.3s",
              }}
              onMouseEnter={(e) =>
                (e.target.style.boxShadow = "0 0 10px rgba(255,255,255,0.3)")
              }
              onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
            >
              {btn.label}
            </button>
          ))}

          <button
            onClick={LogOutButtonClick}
            style={{
              backgroundColor: "#dc2626",
              border: "none",
              color: "white",
              padding: "10px 18px",
              borderRadius: "8px",
              fontWeight: "500",
              letterSpacing: "0.3px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 0 10px rgba(255,0,0,0.5)")
            }
            onMouseLeave={(e) => (e.target.style.boxShadow = "none")}
          >
            🚪 Logout
          </button>
        </div>

        {/* ==== DISPLAY SECTION ==== */}
        <div
          style={{
            marginTop: "40px",
            padding: "25px",
            backgroundColor: "#121a3a",
            borderRadius: "12px",
            boxShadow: "0 0 25px rgba(91,209,255,0.1)",
            maxWidth: "1200px",
          }}
        >
          {isdashboardshow && <AdminDashboard />}
          {isstateshow && <StateMgt />}
          {iscityshow && <CityMgt />}
          {ispcatgshow && <ProductCatgMgt />}
          {isvendershow && <VenderMgt />}
          {isbillshow && <ShowBills />}
          {isproductlistshow && <ProductList />}
          {iscustomershow && <CustomerMgt />}
          {isupdateordershow && < UpdateOrderStatus updatedByName={"Admin"}/>}
        </div>
      </center>
    </div>
  );
}

export default AdminHome;
