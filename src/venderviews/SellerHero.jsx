// import React from "react";
// import "./SellerHero.css";
// import pic1 from "./shopsy_1_1.webp";
// import pic2 from "./Banner_Desktop_1280x545_1.webp";
// import SalesChart from "./SalesChart"; // ✅ import your chart

// export default function SellerHero() {
//   const salesData = [
//     { month: "Jan", sales: 4000 },
//     { month: "Feb", sales: 3000 },
//     { month: "Mar", sales: 5000 },
//     { month: "Apr", sales: 7000 },
//     { month: "May", sales: 6000 },
//     { month: "Jun", sales: 8000 },
//   ];

//   return (
//     <section className="seller-hero">
//       <div className="hero-content">
//         {/* ---------- LEFT TEXT SECTION ---------- */}
//         <div className="text-section">
//           <h1>
//             Become a <span className="highlight">अपनी दुकान Seller</span>
//           </h1>

//           <img src={pic2} alt="Banner" className="hero-banner" />

//           <p>
//             and sell to <strong>50 Crore+</strong> customers across India.
//             Sell on अपनी दुकान Seller Hub and grow your online business easily.
//           </p>

//           <div className="buttons">
//             <button className="btn-primary">Sell On Seller Hub 🚀</button>
//             <button className="btn-secondary">Learn More</button>
//           </div>

//           {/* ✅ SHOP IMAGE + STATS IN ONE ROW */}
//           <div className="shop-stats-row">
//             <img src={pic1} alt="Shop" className="shop-img" />

//             <div className="stats-row">
//               <div className="stat-card">
//                 <div className="icon">👥</div>
//                 <div>
//                   <h3>14 Lakh+</h3>
//                   <p>Seller community</p>
//                 </div>
//               </div>

//               <div className="stat-card">
//                 <div className="icon">🌐</div>
//                 <div>
//                   <h3>24x7</h3>
//                   <p>Online Business</p>
//                 </div>
//               </div>

//               <div className="stat-card">
//                 <div className="icon">🛒</div>
//                 <div>
//                   <h3>50 Crore+</h3>
//                   <p>Customers reachable</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ---------- RIGHT DASHBOARD SECTION ---------- */}
//         <div className="image-section">
//           <div className="dashboard-card">
//             <h4>Sales Dashboard</h4>
//             <p>Track your orders, revenue, and ratings all in one place.</p>

//             <SalesChart data={salesData} />

//             <div className="stats-mini">
//               <div>
//                 <h5>Orders</h5>
//                 <p>1.2K</p>
//               </div>
//               <div>
//                 <h5>Revenue</h5>
//                 <p>₹18L</p>
//               </div>
//               <div>
//                 <h5>Rating</h5>
//                 <p>4.7★</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
import React from "react";
//import "./SellerHero.css";
import pic1 from "./shopsy_1_1.webp";
import pic2 from "./Banner_Desktop_1280x545_1.webp";
import SalesChart from "./SalesChart";

export default function SellerHero() {
  const salesData = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 7000 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 8000 },
  ];

  return (
    <section className="seller-hero">
      <div className="hero-content">
        {/* ---------- LEFT SECTION ---------- */}
        <div className="text-section">
          <h1>
            Become a <span className="highlight">e-Shop Seller</span>
          </h1>

          <img src={pic2} alt="Banner" className="hero-banner" />

          <p>
            and sell to <strong>50 Crore+</strong> customers across India.
            Sell on e-Shop Seller Hub and grow your online business easily.
          </p>

          <div className="buttons">
            <button className="btn-primary">Sell On Seller Hub 🚀</button>
            <button className="btn-secondary">Learn More</button>
          </div>

           {/* <section className="seller-hero"> */}
          {/* IMAGE + 3 STAT CARDS IN ONE ROW */}
          <div className="shop-stats-row">
            <img src={pic1} alt="Shop" className="shop-img" />
            <div className="stats-inline">
              <div className="stat-card">
                <div className="icon">👥</div>
                <div>
                  <h3>14 Lakh+</h3>
                  <p>Seller Community</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="icon">🌐</div>
                <div>
                  <h3>24x7</h3>
                  <p>Online Business</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="icon">🛒</div>
                <div>
                  <h3>50 Crore+</h3>
                  <p>Customers Reachable</p>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* </section> */}
        </div>

        {/* ---------- RIGHT DASHBOARD SECTION ---------- */}
        <div className="image-section">
          <div className="dashboard-card">
            <h4>Sales Dashboard</h4>
            <p>Track your orders, revenue, and ratings all in one place.</p>

            <SalesChart data={salesData} />

            <div className="stats-mini">
              <div>
                <h5>Orders</h5>
                <p>1.2K</p>
              </div>
              <div>
                <h5>Revenue</h5>
                <p>₹18L</p>
              </div>
              <div>
                <h5>Rating</h5>
                <p>4.7★</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
