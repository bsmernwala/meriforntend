import React, { useEffect, useState } from "react";
import axios from "axios";

function PaymentHistory({ cid, onBack }) {
  const [paymentList, setPaymentList] = useState([]);
  const [searchBillId, setSearchBillId] = useState("");
  const [filteredPayment, setFilteredPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  // Load customer payment history
  useEffect(() => {
    alert("Customer Id="+cid)
    if (!cid) return;

    setLoading(true);
    axios
      .get(`${REACT_APP_BASE_API_URL}/paymentdetails/showpaymentdetails`)
      .then((res) => {
        // filter only logged-in customer’s payments
        const custPayments = res.data.filter((p) => p.cid === cid);
        setPaymentList(custPayments);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [cid]);

  // Search by bill ID
  const handleSearch = () => {
    if (!searchBillId) return;
    setLoading(true);

    axios
      .get(
        `${REACT_APP_BASE_API_URL}/paymentdetails/showpaymentdetailsbybid/${searchBillId}`
      )
      .then((res) => {
        if (res.data && res.data.cid === cid) {
          setFilteredPayment(res.data);
        } else {
          setFilteredPayment(null);
          alert("No matching payment found for this bill ID.");
        }
      })
      .catch(() => alert("Error fetching payment details"))
      .finally(() => setLoading(false));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>💳 Payment History</h2>
      <button onClick={onBack} style={{ marginBottom: 20 }}>
        ⬅ Back
      </button>

      {/* Search Section */}
      <div
        style={{
          padding: 15,
          border: "1px solid #ddd",
          borderRadius: 8,
          marginBottom: 20,
          width: "60%",
        }}
      >
        <h3>Search by Bill ID</h3>
        <input
          type="number"
          value={searchBillId}
          onChange={(e) => setSearchBillId(e.target.value)}
          placeholder="Enter Bill ID"
          style={{
            padding: 10,
            width: "60%",
            marginRight: 10,
            borderRadius: 5,
            border: "1px solid gray",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: 5,
          }}
        >
          Search
        </button>
      </div>

      {/* Loading */}
      {loading && <h3>Loading...</h3>}

      {/* Search Result */}
      {filteredPayment && (
        <div
          style={{
            border: "1px solid green",
            padding: 15,
            marginBottom: 20,
            borderRadius: 8,
            background: "#f3fff3",
          }}
        >
          <h3>🔍 Payment Found</h3>
          <p><strong>Bill ID:</strong> {filteredPayment.billid}</p>
          <p><strong>Order ID:</strong> {filteredPayment.orderCreationId}</p>
          <p><strong>Payment ID:</strong> {filteredPayment.razorpayPaymentId}</p>
          <p><strong>Amount:</strong> ₹{filteredPayment.amount}</p>
        </div>
      )}

      <h3>📜 All Payments</h3>

      {/* Payment List Table */}
      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead style={{ background: "#eee" }}>
          <tr>
            <th>Bill ID</th>
            <th>Order ID</th>
            <th>Payment ID</th>
            <th>Amount</th>
          </tr>
        </thead>

        <tbody>
          {paymentList.length ? (
            paymentList.map((p, index) => (
              <tr key={index}>
                <td>{p.billid}</td>
                <td>{p.orderCreationId}</td>
                <td>{p.razorpayPaymentId}</td>
                <td>₹{p.amount}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No payment history found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PaymentHistory;
