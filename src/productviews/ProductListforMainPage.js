// src/productviews/ProductListforMainPage.js 3/1/26
import React, { useEffect, useState } from "react";
import axios from "axios";
import Bill from "../customerviews/Bill";
import CustomerLoginPopup from "../customerviews/CustomerLoginPopup";
import "../index.css";
import "./ProductListForMainPage.css";


function ProductListforMainPage() {
  const [itemcount, setItemCount] = useState(0);
  const [selitems, setSelItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [cid, setCId] = useState(null);
  const [customerSession, setCustomerSession] = useState(null);
  const [pcatglist, setPCatgList] = useState([]);
  const [plist, setPList] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showBill, setShowBill] = useState(false);

const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  
  useEffect(() => {
    axios.get(REACT_APP_BASE_API_URL+"/product/showproduct")
      .then((res) => setPList(res.data))
      .catch((err) => alert(err));
    axios.get(REACT_APP_BASE_API_URL+"/productcatg/showproductcatg")
      .then((res) => setPCatgList(res.data))
      .catch((err) => alert(err));

    const session =
      sessionStorage.getItem("userSession") ||
      localStorage.getItem("userSession");
    if (session) {
      const obj = JSON.parse(session);
      setCustomerSession(obj);
      setCId(obj.cid);
    }
  }, []);

  const handleLoginSuccess = (sessionData) => {
    setCustomerSession(sessionData);
    setCId(sessionData.cid);
    setShowLogin(false);
  };

  const handleBuyButton = (pid) => {
    if (!cid) {
      setShowLogin(true);
      return;
    }

    axios
      .get(`${REACT_APP_BASE_API_URL}/product/showproductstatus/${pid}`)
      .then((res) => {
        if (res.data.status === "Active") {
          const selected = plist.find((item) => item.pid === pid);
          if (!selected) return;

          setSelItems((prev) => {
            const already = prev.find((i) => i.pid === pid);
            if (already) return prev;
            return [...prev, selected];
          });

          setQuantities((prev) => ({
            ...prev,
            [pid]: (prev[pid] || 0) + 1,
          }));
          setItemCount((prev) => prev + 1);
        } else {
          alert("Product out of Stock");
        }
      })
      .catch((err) => alert(err));
  };

  const increaseQty = (pid) => {
    setQuantities((prev) => ({
      ...prev,
      [pid]: (prev[pid] || 1) + 1,
    }));
    setItemCount((prev) => prev + 1);
  };

  const decreaseQty = (pid) => {
    setQuantities((prev) => {
      const newQty = (prev[pid] || 1) - 1;
      if (newQty <= 0) {
        setSelItems((old) => old.filter((item) => item.pid !== pid));
        return Object.fromEntries(
          Object.entries(prev).filter(([k]) => k !== String(pid))
        );
      }
      return { ...prev, [pid]: newQty };
    });
    setItemCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleCheckOutButton = () => {
    if (!cid) {
      setShowLogin(true);
      return;
    }
    if (selitems.length <= 0) {
      alert("Please buy some products before checkout.");
      return;
    }
    setShowBill(true);
  };

  const handleSearch = (evt) => {
    const catgId = evt.target.value;
    if (catgId === "select") return;

    const url =
      catgId > 0
        ?   `${REACT_APP_BASE_API_URL}/product/showproductbycatgid/${catgId}`
        : `${REACT_APP_BASE_API_URL}/product/showproduct`;

    axios
      .get(url)
      .then((res) => setPList(res.data))
      .catch((err) => alert(err));
  };

  if (showBill) {
    return (
      <Bill
        data={{ selitems, cid, quantities }}
        onBack={() => setShowBill(false)}
        onPaymentSuccess={() => {
          setSelItems([]);
          setQuantities({});
          setItemCount(0);
          setShowBill(false);
        }}
      />
    );
  }

const handleLogout = () => {
  // Clear session from both storages
  localStorage.removeItem("userSession");
  sessionStorage.removeItem("userSession");

  // Clear React states
  setCustomerSession(null);
  setCId(null);
  setSelItems([]);
  setQuantities({});
  setItemCount(0);

  // Optionally, hide bill/login popup if open
  setShowBill(false);
  setShowLogin(false);
};


  return (
    <>
      {showLogin && (
        <CustomerLoginPopup
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* HEADER */}
<header className="eshop-header">
  {/* Left: User Info */}
  <div className="eshop-user">
    <img
      className="user-avatar"
      src={
        customerSession
          ? customerSession.cpicname
          : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
      }
      alt={customerSession ? customerSession.cfname : "Guest"}
    />
    <span className="username">
      {customerSession ? customerSession.cfname : "Guest"}
    </span>

    {/* Show Logout only if logged in */}
    {customerSession && (
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    )}
  </div>

  {/* Center: Title */}
  <div className="eshop-title">🛍️ E-Shop</div>

  {/* Right: Search + Cart + Checkout */}
  <div className="eshop-search">
    <select className="select" onChange={handleSearch}>
      <option value="select">🔍 Search by Category</option>
      <option value="0">All Products</option>
      {pcatglist.map((pcatgitem) => (
        <option key={pcatgitem.pcatgid} value={pcatgitem.pcatgid}>
          {pcatgitem.pcatgname}
        </option>
      ))}
    </select>

    <span className="cart" data-count={itemcount}>🛒</span>

    <button className="checkout-btn" onClick={handleCheckOutButton}>
      Checkout
    </button>
  </div>
</header>

      {/* PRODUCTS */}
      <div className="product-list-wide">
        {plist.map((item) => {
          const cname =
            pcatglist.find((c) => c.pcatgid === item.pcatgid)?.pcatgname ||
            "N/A";
          const qty = quantities[item.pid] || 0;
          const imageUrl = item.ppicname?.startsWith("http")
            ? item.ppicname
            : `https://res.cloudinary.com/<your-cloud-name>/image/upload/${item.ppicname}`;

          return (
            <div className="product-card dark-card" key={item.pid}>
              <img className="product-image" src={imageUrl} alt={item.pname} />
              <h4>{item.pname}</h4>
              <p>
                ₹{item.oprice}{" "}
                <span className="strike">₹{item.pprice}</span>
              </p>
              <p>{cname}</p>

              {qty > 0 ? (
                <div className="quantity-controls">
                  <button onClick={() => decreaseQty(item.pid)}>-</button>
                  <span>{qty}</span>
                  <button onClick={() => increaseQty(item.pid)}>+</button>
                </div>
              ) : (
                <button
                  className="buy"
                  onClick={() => handleBuyButton(item.pid)}
                >
                  🛒 Buy
                </button>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

export default ProductListforMainPage;
