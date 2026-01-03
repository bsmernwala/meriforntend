// export default VendorSales;
//6/11/25
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import "./VendorSales.css";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function VendorSales({ vender, onLogout }) {
  const [sales, setSales] = useState([]);
  const [salesSearch, setSalesSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [salesPage, setSalesPage] = useState(1);
  const [salesPerPage] = useState(10);

  const [grandTotal, setGrandTotal] = useState(0);
  const [productTotals, setProductTotals] = useState({});
  const [totalProductsSold, setTotalProductsSold] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const chartRef = useRef(null);
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  // Fetch sales data
  useEffect(() => {
    if (!vender?.Vid) return;
    const fetchSales = async () => {
      try {
        const res = await axios.get(
          `${REACT_APP_BASE_API_URL}/sales/vender/${vender.Vid}`
        );
        setSales(res.data.sales || []);
      } catch (err) {
        console.error(err);
        alert("Error fetching sales data");
      }
    };
    fetchSales();
  }, [vender.Vid]);

  // Filter logic
  const filteredSales = sales.filter((s) => {
    const productName = s.product?.pname?.toLowerCase() || "";
    const billIdStr = s.billid ? s.billid.toString() : "";
    const searchLower = salesSearch.toLowerCase();
    const matchSearch =
      productName.includes(searchLower) || billIdStr.includes(searchLower);
    const saleDate = new Date(s.date);
    const matchDate =
      (!fromDate || saleDate >= new Date(fromDate)) &&
      (!toDate || saleDate <= new Date(toDate));
    return matchSearch && matchDate;
  });

  const totalPages = Math.ceil(filteredSales.length / salesPerPage);
  const startIndex = (salesPage - 1) * salesPerPage;
  const currentSales = filteredSales.slice(
    startIndex,
    startIndex + salesPerPage
  );

  // Compute totals
  useEffect(() => {
    const totalRevenue = filteredSales.reduce(
      (sum, s) => sum + (s.totalPrice || 0),
      0
    );
    setGrandTotal(totalRevenue);
    const summary = {};
    let totalQty = 0;
    filteredSales.forEach((s) => {
      const pname = s.product?.pname || "Unknown";
      if (!summary[pname]) summary[pname] = { qty: 0, revenue: 0 };
      summary[pname].qty += s.quantity;
      summary[pname].revenue += s.totalPrice;
      totalQty += s.quantity;
    });
    setProductTotals(summary);
    setTotalProductsSold(totalQty);
  }, [filteredSales]);

  // Chart
  const productNames = Object.keys(productTotals);
  const colors = productNames.map((_, i) => `hsl(${(i * 45) % 360}, 70%, 55%)`);
  const chartData = {
    labels: productNames,
    datasets: [
      {
        label: "Revenue (₹)",
        data: Object.values(productTotals).map((p) => p.revenue),
        backgroundColor: colors,
        borderColor: colors.map((c) => c.replace("55%", "45%")),
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true, ticks: { callback: (v) => `₹${v}` } } },
  };

  // Export PDFs (main + per product)
  const exportPDF = async () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    doc.setFontSize(14);
    doc.text(`Vendor: ${vender.VenderName}`, 14, 15);
    doc.text(`Date: ${currentDate}`, 14, 22);
    doc.setFontSize(16);
    doc.text("Sales Report", 150, 15, { align: "right" });
    if (fromDate || toDate)
      doc.text(`(${fromDate || "All"} → ${toDate || "Now"})`, 150, 22, {
        align: "right",
      });
    doc.autoTable({
      startY: 30,
      head: [
        ["Bill ID", "Date", "Product", "Qty", "Price", "Offer Price", "Total"],
      ],
      body: filteredSales.map((s) => [
        s.billid,
        new Date(s.date).toLocaleDateString(),
        s.product?.pname || "Unknown",
        s.quantity,
        s.product?.pprice || "-",
        s.product?.oprice || "-",
        s.totalPrice,
      ]),
    });
    let y = doc.lastAutoTable.finalY + 10;
    doc.text("Per-Product Summary", 14, y);
    doc.autoTable({
      startY: y + 5,
      head: [["Product", "Total Qty", "Revenue"]],
      body: Object.keys(productTotals).map((p) => [
        p,
        productTotals[p].qty,
        productTotals[p].revenue,
      ]),
    });
    y = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Products Sold: ${totalProductsSold}`, 14, y);
    y += 8;
    doc.text(`Grand Total Sales: ₹${grandTotal.toLocaleString("en-IN")}`, 14, y);
    y += 15;
    if (chartRef.current) {
      const chartImage = chartRef.current.toBase64Image();
      const pageWidth = doc.internal.pageSize.getWidth();
      const chartWidth = 150;
      const chartHeight = 90;
      const x = (pageWidth - chartWidth) / 2;
      doc.addImage(chartImage, "PNG", x, y, chartWidth, chartHeight);
    }
    doc.save(`Vendor_${vender.Vid}_Sales_Report.pdf`);
  };

  const exportProductPDF = (productName, productSales) => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString();
    const product = productSales[0]?.product;
    doc.setFontSize(14);
    doc.text(`Vendor: ${vender.VenderName}`, 14, 15);
    doc.text(`Date: ${currentDate}`, 14, 22);
    doc.setFontSize(16);
    doc.text(`${productName} - Sales Details`, 150, 15, { align: "right" });
    const startY = 30;
    doc.autoTable({
      startY,
      head: [["Bill ID", "Date", "Qty", "Price", "Offer Price", "Total"]],
      body: productSales.map((s) => [
        s.billid,
        new Date(s.date).toLocaleDateString(),
        s.quantity,
        s.product?.pprice || "-",
        s.product?.oprice || "-",
        s.totalPrice,
      ]),
    });
    const totalRevenue = productSales.reduce((sum, s) => sum + s.totalPrice, 0);
    const totalQty = productSales.reduce((sum, s) => sum + s.quantity, 0);
    let y = doc.lastAutoTable.finalY + 10;
    doc.text(`Total Qty Sold: ${totalQty}`, 14, y);
    y += 8;
    doc.text(`Total Revenue: ₹${totalRevenue.toLocaleString("en-IN")}`, 14, y);
    doc.save(`${productName}_Sales_Details.pdf`);
  };

  return (
    <div className="vendor-sales-page">
      {/* HEADER like VendorHome */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#007bff",
          color: "white",
          padding: "8px 15px",
          borderRadius: "6px",
          marginBottom: "15px",
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ margin: 0, flex: "1 1 auto" }}>Vendor Sales Report</h3>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: "2 1 auto",
            justifyContent: "center",
          }}
        >
         
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flex: "1 1 auto",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={exportPDF}
            className="btn btn-light btn-sm"
            disabled={!filteredSales.length}
          >
            📄 Export PDF
          </button>
          {/* <button onClick={onLogout} className="btn btn-danger btn-sm">
            Logout
          </button> */}
        </div>
      </header>

      {/* CONTENT */}
      <div className="vendor-sales-content" style={{ padding: "10px" }}>
        <div className="filters" style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Search by Bill ID or Product"
            value={salesSearch}
            onChange={(e) => {
              setSalesSearch(e.target.value);
              setSalesPage(1);
            }}
          />
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <button
              onClick={() => {
                setFromDate("");
                setToDate("");
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="sales-table-wrapper">
          {filteredSales.length === 0 ? (
            <p style={{ textAlign: "center" }}>No sales found.</p>
          ) : (
            <table border="1" cellPadding="8" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Bill ID</th>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Offer Price</th>
                  <th>Total</th>
                  <th>Photo</th>
                </tr>
              </thead>
              <tbody>
                {currentSales.map((s) => (
                  <tr key={s._id}>
                    <td>{s.billid}</td>
                    <td>{new Date(s.date).toLocaleDateString()}</td>
                    <td>{s.product?.pname}</td>
                    <td>{s.quantity}</td>
                    <td>{s.product?.pprice}</td>
                    <td>{s.product?.oprice}</td>
                    <td>{s.totalPrice}</td>
                    <td>
                      <img
                        src={s.product?.ppicname}
                        alt={s.product?.pname}
                        style={{
                          height: "45px",
                          width: "45px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setSalesPage(i + 1)}
                style={{
                  margin: "2px",
                  backgroundColor: salesPage === i + 1 ? "#007bff" : "#eee",
                  color: salesPage === i + 1 ? "white" : "black",
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        <h5>Per-Product Summary </h5>
        <table border="1" cellPadding="8" style={{ width: "100%"}}>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Product</th>
              <th>Total Qty</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(productTotals).map((p) => {
              const product = sales.find((s) => s.product?.pname === p)?.product;
              return (
                <tr
                  key={p}
                  onClick={() => {
                    setSelectedProduct(p);
                    setPopupVisible(true);
                  }}
                  style={{ backgroundColor: "#1f56ecff", cursor: "pointer" }}
                >
                  <td>
                    <img
                      src={product?.ppicname}
                      alt={p}
                      style={{
                        height: "45px",
                        width: "45px",
                        objectFit: "cover",
                        borderRadius: "6px",
                      }}
                    />
                  </td>
                  <td>{p}</td>
                  <td>{productTotals[p].qty}</td>
                  <td>{productTotals[p].revenue}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h5>Total Products Sold: {totalProductsSold}</h5>
        <h5>Grand Total Sales: ₹{grandTotal.toLocaleString("en-IN")}</h5>

        {Object.keys(productTotals).length > 0 && (
          <details style={{ marginTop: "20px" }}>
            <summary>📊 View Revenue Chart</summary>
            <div style={{ width: "100%", maxWidth: "800px", margin: "20px auto" }}>
              <Bar ref={chartRef} data={chartData} options={chartOptions} />
            </div>
          </details>
        )}
      </div>

      {/* POPUP */}
      {popupVisible && selectedProduct && (
        <div className="popup-overlay">
          <div className="popup-content">
            {(() => {
              const productSales = filteredSales.filter(
                (s) => s.product?.pname === selectedProduct
              );
              const totalQty = productSales.reduce(
                (sum, s) => sum + s.quantity,
                0
              );
              const totalRevenue = productSales.reduce(
                (sum, s) => sum + s.totalPrice,
                0
              );
              const product = productSales[0]?.product;

              return (
                <>
                  <div className="popup-header">
                    <img
                      src={product?.ppicname || "/default.png"}
                      alt={selectedProduct}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginRight: "15px",
                      }}
                    />
                    <div>
                      <h2>{selectedProduct}</h2>
                      <p>
                        <strong>Total Quantity Sold:</strong> {totalQty}
                      </p>
                      <p>
                        <strong>Total Revenue:</strong> ₹
                        {totalRevenue.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <table className="popup-table">
                    <thead>
                      <tr>
                        <th>Bill ID</th>
                        <th>Date</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Offer</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productSales.map((s) => (
                        <tr key={s._id}>
                          <td>{s.billid}</td>
                          <td>{new Date(s.date).toLocaleDateString()}</td>
                          <td>{s.quantity}</td>
                          <td>{s.product?.pprice}</td>
                          <td>{s.product?.oprice}</td>
                          <td>{s.totalPrice}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="popup-buttons">
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() =>
                        exportProductPDF(selectedProduct, productSales)
                      }
                    >
                      📄 Download PDF
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setPopupVisible(false)}
                    >
                      ❌ Close
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      <footer className="footer-marquee">
        <marquee>www.sabkuchmiltahai.com</marquee>
      </footer>
    </div>
  );
}

export default VendorSales;
