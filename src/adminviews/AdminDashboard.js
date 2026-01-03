// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  FaUsers,
  FaBoxOpen,
  FaMoneyBillWave,
  FaShoppingCart,
  FaDownload,
  FaSun,
  FaMoon,
} from "react-icons/fa";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import "./AdminDashboard.css";

function AdminDashboard() {
  //Read API URL from .env
  const REACT_APP_BASE_API_URL = process.env.REACT_APP_BASE_API_URL ;
  // ===== core states =====
  const [dashboardData, setDashboardData] = useState({});
  const [categorySales, setCategorySales] = useState([]);
  const [categoryShare, setCategoryShare] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [dailySales, setDailySales] = useState([]);
  const [viewMode, setViewMode] = useState("amount");
  const [loading, setLoading] = useState(true);

  // ===== global top filters (unchanged) =====
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [theme, setTheme] = useState(localStorage.getItem("admindash-theme") || "dark");

  // ===== summary-specific filters (independent) =====
  const [dashMonth, setDashMonth] = useState("");
  const [dashYear, setDashYear] = useState("");

  // ===== per-chart local filters (one pair per chart) =====
  const [mRevenueMonth, setMRevenueMonth] = useState("");
  const [mRevenueYear, setMRevenueYear] = useState(new Date().getFullYear());

  const [catSalesMonth, setCatSalesMonth] = useState("");
  const [catSalesYear, setCatSalesYear] = useState(new Date().getFullYear());

  const [pMonthlyMonth, setPMonthlyMonth] = useState("");
  const [pMonthlyYear, setPMonthlyYear] = useState(new Date().getFullYear());

  const [catShareMonth, setCatShareMonth] = useState("");
  const [catShareYear, setCatShareYear] = useState(new Date().getFullYear());

  const [topProductsMonth, setTopProductsMonth] = useState("");
  const [topProductsYear, setTopProductsYear] = useState(new Date().getFullYear());

  const [dailyMonth, setDailyMonth] = useState("");
  const [dailyYear, setDailyYear] = useState(new Date().getFullYear());

  const [pTotalMonth, setPTotalMonth] = useState("");
  const [pTotalYear, setPTotalYear] = useState(new Date().getFullYear());

  // ===== product chart data (kept from your code) =====
  const [productMonthlySales, setProductMonthlySales] = useState([]);
  const [productMonthSales, setProductMonthSales] = useState([]);

  const monthNames = [
    "", "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("admindash-theme", theme);
  }, [theme]);

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([
      // by default load dashboard with no filters (all-time)
      fetchDashboardData(),
      fetchCategorySales(),
      fetchCategoryShare(),
      fetchTopProducts(),
      fetchDailySales(),
      fetchProductMonthlySales(),
      fetchProductMonthSales(),
    ]);
    setLoading(false);
  };

  // ================= Backend fetchers (all accept optional month/year params) =================

  // Fetch dashboard (summary + monthlyRevenue + categoryShare)
  // If m is provided, it will call /admin/dashboard?month=m&year=y
  // If m is empty but y provided, it calls ?year=y
  const fetchDashboardData = async (m = null, y = null) => {
    try {
      let query = "";
      if (m) query = `?month=${m}&year=${y || new Date().getFullYear()}`;
      else if (y) query = `?year=${y}`;
      const url = `${REACT_APP_BASE_API_URL}/admin/dashboard${query}`;
      const res = await axios.get(url);
      setDashboardData(res.data || {});
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    }
  };

  const fetchCategorySales = async (m = null, y = null) => {
    try {
      const query = m ? `?month=${m}&year=${y}` : "";
      const res = await axios.get(`${REACT_APP_BASE_API_URL}/admin/category-sales${query}`);
      setCategorySales(res.data || []);
    } catch (err) {
      console.error("Error fetching category sales:", err);
    }
  };

  const fetchCategoryShare = async (m = null, y = null) => {
    try {
      const query = m ? `?month=${m}&year=${y}` : "";
      const res = await axios.get(`${REACT_APP_BASE_API_URL}/admin/category-share${query}`);
      setCategoryShare(res.data || []);
    } catch (err) {
      console.error("Error fetching category share:", err);
    }
  };

  const fetchTopProducts = async (m = null, y = null) => {
    try {
      const query = m ? `?limit=5&month=${m}&year=${y}` : `?limit=5`;
      const res = await axios.get(`${REACT_APP_BASE_API_URL}/admin/top-products${query}`);
      setTopProducts(res.data || []);
    } catch (err) {
      console.error("Error fetching top products:", err);
    }
  };

  const fetchDailySales = async (m = null, y = null) => {
    try {
      const query = m ? `?month=${m}&year=${y}` : "";
      const res = await axios.get(`${REACT_APP_BASE_API_URL}/admin/daily-sales${query}`);
      setDailySales(res.data || []);
    } catch (err) {
      console.error("Error fetching daily sales:", err);
    }
  };

  const fetchProductMonthlySales = async (m = null, y = null) => {
    try {
      // if user left empty, backend endpoint expects month/year — original behavior used current month
      const query = m ? `?month=${m}&year=${y}` : `?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`;
      const res = await axios.get(`${REACT_APP_BASE_API_URL}/admin/product-monthly-sales${query}`);
      setProductMonthlySales(res.data || []);
    } catch (err) {
      console.error("Error fetching product monthly sales:", err);
    }
  };

  const fetchProductMonthSales = async (m = null, y = null) => {
    try {
      const query = m ? `?month=${m}&year=${y}` : `?month=${new Date().getMonth() + 1}&year=${new Date().getFullYear()}`;
      const res = await axios.get(`${REACT_APP_BASE_API_URL}/admin/product-wise-sales-by-month${query}`);
      setProductMonthSales(res.data || []);
    } catch (err) {
      console.error("Error fetching product-wise monthly sales:", err);
    }
  };

  // ================= Export / download helpers (unchanged) =================
  const jsonToCSV = (json, columns) => {
    if (!json || !json.length) return "";
    const header = columns.join(",");
    const rows = json.map((row) =>
      columns.map((col) => {
        const v = row[col] ?? row[col] === 0 ? row[col] : "";
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(",")
    );
    return [header, ...rows].join("\r\n");
  };

  const downloadCSV = (data, filename = "export.csv", columns = null) => {
    if (!data || !data.length) {
      alert("No data to export");
      return;
    }
    const cols = columns || Object.keys(data[0]);
    const csv = jsonToCSV(data, cols);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, filename);
  };

  const downloadPNGofElement = async (elementId, filename = "chart.png") => {
    const el = document.getElementById(elementId);
    if (!el) {
      alert("Element not found");
      return;
    }
    const canvas = await html2canvas(el, { scale: 2, useCORS: true });
    canvas.toBlob((blob) => {
      saveAs(blob, filename);
    });
  };

  // ================= UI helpers =================
  const handleToggle = () => {
    setViewMode((prev) => (prev === "amount" ? "quantity" : "amount"));
  };

  const applyTopFilters = async () => {
    // existing global top filter apply behavior (keeps old thing)
    setLoading(true);
    await Promise.all([fetchDashboardData(selectedMonth, selectedYear), fetchDailySales(selectedMonth, selectedYear)]);
    setLoading(false);
  };

  // initial fetch for product-specific charts (default to current month)
  useEffect(() => {
    fetchProductMonthlySales();
    fetchProductMonthSales();
    // eslint-disable-next-line
  }, []);

  if (loading) return <div className="loader">⏳ Loading Dashboard Data...</div>;

  const barColor = viewMode === "amount" ? "#00C49F" : "#FFBB28";
  const dataKey = viewMode === "amount" ? "totalAmount" : "totalQty";
  const label = viewMode === "amount" ? "Total Sales (₹)" : "Total Quantity";

  // small helper to render month/year label
  const renderHeaderLabel = (m, y, fallback) =>
    m ? `${monthNames[m]} ${y}` : (y ? `${y}` : fallback);

  return (
    <div className="admin-dashboard">
      {/* ================= TOP GLOBAL FILTERS (unchanged) ================= */}
      <div className="top-controls">
        <div className="left-controls">
          <div className="filters">
            <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="">All Months</option>
              {monthNames.slice(1).map((m, i) => (
                <option key={i+1} value={i+1}>{m}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {[2023, 2024, 2025, 2026].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            <button className="filter-btn" onClick={applyTopFilters}>Apply</button>
          </div>
        </div>

        <div className="right-controls">
          <button className="theme-btn" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>

      {/* ================= SUMMARY: add independent selectors for summary (dashMonth/dashYear) ================= */}
      <div className="summary-filter-row" style={{ margin: "12px 0", display: "flex", gap: "8px", alignItems: "center" }}>
        <select value={dashMonth} onChange={(e) => setDashMonth(e.target.value)}>
          <option value="">All Months</option>
          {monthNames.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
        </select>
        <select value={dashYear} onChange={(e) => setDashYear(e.target.value)}>
          <option value="">All Years</option>
          {[2023, 2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
        <button className="filter-btn" onClick={() => fetchDashboardData(dashMonth, dashYear)}>Apply</button>
        <div style={{ marginLeft: 12, color: "#aaa" }}>
          Summary filter — selecting month/year updates the top cards and the Monthly Revenue chart.
        </div>
      </div>

      {/* ===== Summary Cards (values come from dashboardData) ===== */}
      <div className="summary-cards">
        <div className="summary-card">
          <FaMoneyBillWave />
          <h3>Total Revenue</h3>
          <p>₹{dashboardData.totalRevenue || 0}</p>
        </div>

        <div className="summary-card">
          <FaUsers />
          <h3>Total Customers</h3>
          <p>{dashboardData.totalCustomers || 0}</p>
        </div>

        <div className="summary-card">
          <FaBoxOpen />
          <h3>Total Products</h3>
          <p>{dashboardData.totalProducts || 0}</p>
        </div>

        <div className="summary-card">
          <FaShoppingCart />
          <h3>Total Sales</h3>
          <p>{dashboardData.totalSales || 0}</p>
        </div>
      </div>

      {/* ===== 1. Monthly Revenue Chart (Line) ===== */}
      <div className="chart-section" id="monthly-revenue-section">
        <div className="chart-header">
          <h3>📈 Monthly Sales Revenue ({renderHeaderLabel(mRevenueMonth, mRevenueYear, mRevenueYear)})</h3>
          <div>
            <div className="filters">
              <select value={mRevenueMonth} onChange={(e) => setMRevenueMonth(e.target.value)}>
                <option value="">All Months</option>
                {monthNames.slice(1).map((m, i) => (
                  <option key={i+1} value={i+1}>{m}</option>
                ))}
              </select>
              <select value={mRevenueYear} onChange={(e) => setMRevenueYear(e.target.value)}>
                {[2023, 2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
              <button className="filter-btn" onClick={() => fetchDashboardData(mRevenueMonth, mRevenueYear)}>Apply</button>
            </div>

            <button className="export-btn" onClick={() => downloadCSV(dashboardData.monthlyRevenue || [], "monthly_revenue.csv", ["month", "revenue"])}>
              <FaDownload /> CSV
            </button>
            <button className="export-btn" onClick={() => downloadPNGofElement("monthly-revenue-section", "monthly_revenue.png")}>
              <FaDownload /> PNG
            </button>
          </div>
        </div>

        <ResponsiveContainer width="95%" height={350}>
          <LineChart data={dashboardData.monthlyRevenue || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="month" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#00C49F"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
              name="Revenue (₹)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== 2. Category-wise Sales (Bar) ===== */}
      <div className="chart-section" id="category-sales-section">
        <div className="chart-header">
          <h3>💰 Category-wise Sales Report ({renderHeaderLabel(catSalesMonth, catSalesYear, "All")})</h3>
          <div>
            <div className="filters">
              <select value={catSalesMonth} onChange={(e) => setCatSalesMonth(e.target.value)}>
                <option value="">All Months</option>
                {monthNames.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
              <select value={catSalesYear} onChange={(e) => setCatSalesYear(e.target.value)}>
                {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button className="filter-btn" onClick={() => fetchCategorySales(catSalesMonth, catSalesYear)}>Apply</button>
            </div>

            <button className="toggle-btn" onClick={handleToggle}>
              {viewMode === "amount" ? "Switch to Quantity View" : "Switch to Revenue View"}
            </button>
            <button className="export-btn" onClick={() => downloadCSV(categorySales, "category_sales.csv")}>
              <FaDownload /> CSV
            </button>
            <button className="export-btn" onClick={() => downloadPNGofElement("category-sales-section", "category_sales.png")}>
              <FaDownload /> PNG
            </button>
          </div>
        </div>

        <ResponsiveContainer width="90%" height={350}>
          <BarChart data={categorySales}>
            <XAxis dataKey="category" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
            <Legend />
            <Bar dataKey={dataKey} fill={barColor} name={label} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    
      {/* ===== 4. Category Share (Pie) ===== */}
      <div className="chart-section" id="category-share-section">
        <div className="chart-header">
          <h3>🥧 Category Share ({renderHeaderLabel(catShareMonth, catShareYear, "Catalog")})</h3>
          <div>
            <div className="filters">
              <select value={catShareMonth} onChange={(e) => setCatShareMonth(e.target.value)}>
                <option value="">Catalog / All</option>
                {monthNames.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
              <select value={catShareYear} onChange={(e) => setCatShareYear(e.target.value)}>
                {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button className="filter-btn" onClick={() => fetchCategoryShare(catShareMonth, catShareYear)}>Apply</button>
            </div>

            <button className="export-btn" onClick={() => downloadCSV(categoryShare, "category_share.csv")}>
              <FaDownload /> CSV
            </button>
            <button className="export-btn" onClick={() => downloadPNGofElement("category-share-section", "category_share.png")}>
              <FaDownload /> PNG
            </button>
          </div>
        </div>

        <ResponsiveContainer width="90%" height={400}>
          <PieChart>
            <Pie
              data={categoryShare}
              dataKey="count"
              nameKey="pcatgname"
              outerRadius={150}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
            >
              {categoryShare.map((_, index) => (
                <Cell key={index} fill={[
                  "#00C49F",
                  "#FFBB28",
                  "#FF8042",
                  "#0088FE",
                  "#A020F0",
                  "#FF4560",
                ][index % 6]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* ===== 5. Top Selling Products (Bar) ===== */}
      <div className="chart-section" id="top-products-section">
        <div className="chart-header">
          <h3>🏆 Top 5 Selling Products ({renderHeaderLabel(topProductsMonth, topProductsYear, "All")})</h3>
          <div>
            <div className="filters">
              <select value={topProductsMonth} onChange={(e) => setTopProductsMonth(e.target.value)}>
                <option value="">All Months</option>
                {monthNames.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
              <select value={topProductsYear} onChange={(e) => setTopProductsYear(e.target.value)}>
                {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button className="filter-btn" onClick={() => fetchTopProducts(topProductsMonth, topProductsYear)}>Apply</button>
            </div>

            <button className="export-btn" onClick={() => downloadCSV(topProducts, "top_products.csv")}>
              <FaDownload /> CSV
            </button>
            <button className="export-btn" onClick={() => downloadPNGofElement("top-products-section", "top_products.png")}>
              <FaDownload /> PNG
            </button>
          </div>
        </div>

        <ResponsiveContainer width="90%" height={350}>
          <BarChart data={topProducts}>
            <XAxis dataKey="_id" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
            <Legend />
            <Bar dataKey="totalRevenue" fill="#00C49F" name="Revenue (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== 6. Daily Sales Trend (Line) ===== */}
      <div className="chart-section" id="daily-sales-section">
        <div className="chart-header">
          <h3>📅 Daily Sales Trend ({renderHeaderLabel(dailyMonth, dailyYear, `${monthNames[new Date().getMonth()+1]} ${new Date().getFullYear()}`)})</h3>
          <div>
            <div className="filters">
              <select value={dailyMonth} onChange={(e) => setDailyMonth(e.target.value)}>
                <option value="">Current Month</option>
                {monthNames.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
              <select value={dailyYear} onChange={(e) => setDailyYear(e.target.value)}>
                {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button className="filter-btn" onClick={() => fetchDailySales(dailyMonth, dailyYear)}>Apply</button>
            </div>

            <button className="export-btn" onClick={() => downloadCSV(dailySales, "daily_sales.csv")}>
              <FaDownload /> CSV
            </button>
            <button className="export-btn" onClick={() => downloadPNGofElement("daily-sales-section", "daily_sales.png")}>
              <FaDownload /> PNG
            </button>
          </div>
        </div>

        <ResponsiveContainer width="95%" height={350}>
          <LineChart data={dailySales}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="_id" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalSales"
              stroke="#ffbb28"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Sales (₹)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ===== 7. Product-wise Total Sales (Bar) ===== */}
      <div className="chart-section">
        <div className="chart-header">
          <h3>📦 Product-wise Total Sales ({renderHeaderLabel(pTotalMonth, pTotalYear, "All")})</h3>
          <div>
            <div className="filters">
              <select value={pTotalMonth} onChange={(e) => setPTotalMonth(e.target.value)}>
                <option value="">All Months</option>
                {monthNames.slice(1).map((m, i) => <option key={i+1} value={i+1}>{m}</option>)}
              </select>
              <select value={pTotalYear} onChange={(e) => setPTotalYear(e.target.value)}>
                {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <button className="filter-btn" onClick={() => fetchProductMonthSales(pTotalMonth, pTotalYear)}>Apply</button>
            </div>

            <button className="export-btn" onClick={() => downloadCSV(productMonthSales, "product_total_sales.csv")}>
              <FaDownload /> CSV
            </button>
          </div>
        </div>

        {productMonthSales.length === 0 ? (
          <p style={{ color: "#aaa" }}>No sales data for this month.</p>
        ) : (
          <ResponsiveContainer width="95%" height={400}>
            <BarChart data={productMonthSales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="product" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip contentStyle={{ backgroundColor: "#222", color: "#fff" }} />
              <Legend />
              <Bar dataKey="totalSales" fill="#00C49F" name="Total Sales (₹)" />
              <Bar dataKey="totalQty" fill="#FFBB28" name="Quantity Sold" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
