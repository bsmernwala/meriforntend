//15/11/25
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OrderTracking.css";

const STATUS_FLOW = [
  "Processing",
  "Order Placed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

function OrderTracking({ CUserId }) {
  const [billIds, setBillIds] = useState([]);
  const [billid, setBillid] = useState("");
  const [order, setOrder] = useState(null);

  const cid = CUserId;
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  // Load bill numbers of logged-in customer
  useEffect(() => {
    if (cid) {
      axios
        .get(`${REACT_APP_BASE_API_URL}/bill/billshowbillids/${cid}`)
        .then((res) => setBillIds(res.data))
        .catch((err) => console.log(err));
    }
  }, [cid]);

  // Load full order details
  const loadOrder = async (billid) => {
    const res = await axios.get(
      `${REACT_APP_BASE_API_URL}/bill/trackorder/${billid}`
    );
    setOrder(res.data);
  };

  const currentIndex = order
    ? STATUS_FLOW.indexOf(order.status)
    : 0;

  return (
    <div className="tracking-container">
      <h2 className="tracking-title">Track Your Order</h2>

      {/* Bill Dropdown */}
      <label className="label">Select Bill/Order Number:</label>
      <select
        className="bill-select"
        value={billid}
        onChange={(e) => {
          setBillid(e.target.value);
          loadOrder(e.target.value);
        }}
      >
        <option value="">-- Select Bill Number --</option>
        {billIds.map((b, i) => (
          <option key={i} value={b.billid}>
            {b.billid} ({b.billdate})
          </option>
        ))}
      </select>

      {/* Only show UI if order selected */}
      {order && (
        <div className="order-card">

          {/* Top Order Info */}
          <h3>Bill No: {order.billid}</h3>
          <p><strong>Date:</strong> {order.billdate}</p>

          {/* Status badge */}
          <p>
            <strong>Status:</strong>{" "}
            <span className={`status-badge status-${order.status.replace(/\s+/g, "")}`}>
              {order.status}
            </span>
          </p>

          <p><strong>Product ID:</strong> {order.pid}</p>
          <p><strong>Quantity:</strong> {order.qty}</p>

          {/* Progress Bar */}
          <div className="progress-wrapper">
            <div className="progress-line">
              <div
                className="progress-fill"
                style={{
                  width: `${(currentIndex / (STATUS_FLOW.length - 1)) * 100}%`
                }}
              ></div>
            </div>

            <div className="progress-steps">
              {STATUS_FLOW.map((s, index) => (
                <div
                  key={index}
                  className={`progress-step ${
                    index <= currentIndex ? "active" : ""
                  }`}
                >
                  <div className="step-circle">{index + 1}</div>
                  <div className="step-label">{s}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline">
            {STATUS_FLOW.map((status, index) => (
              <div
                key={index}
                className={`timeline-item ${
                  index <= currentIndex ? "completed" : ""
                }`}
              >
                <div className="timeline-marker"></div>
                <div className="timeline-content">{status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderTracking;

