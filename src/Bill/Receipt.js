
import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "./Receipt.css";

import "jspdf-autotable"; // ⬅️ import the plugin


function Receipt({ billid, onClose }) {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;    
  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await axios.get(
          `${REACT_APP_BASE_API_URL}/paymentdetails/showpaymentdetailsbybid/${billid}`
        );
        setReceipt(res.data);
      } catch (err) {
        setError("❌ Failed to fetch receipt.");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [billid]);

  
  const handleDownloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(" Payment Receipt", 14, 22);

  const tableData = [
    ["Customer ID", receipt.cid],
    ["Customer Name", receipt.customerName],
    ["Bill ID", receipt.billid],
    ["Amount Paid", `RS ${receipt.amount}`],
    ["Razorpay Order ID", receipt.razorpayOrderId],
    ["Razorpay Payment ID", receipt.razorpayPaymentId],
    ["Transaction Date", new Date(receipt.created_at).toLocaleString()],
  ];

  doc.autoTable({
    startY: 30,
    head: [["Field", "Value"]],
    body: tableData,
    styles: {
      fontSize: 12,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [76, 175, 80], // green header
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });

  doc.save(`Receipt_${receipt.billid}.pdf`);
};

  if (loading)
    return (
      <div className="receipt-loading">
        <div className="spinner"></div>
        <p>Loading receipt...</p>
      </div>
    );

  if (error) return <p className="error">{error}</p>;
  if (!receipt) return <p>No receipt found for Bill ID {billid}</p>;

  return (
    <div className="receipt-container">
      <h2>🧾 Payment Receipt</h2>
      <table>
        <tbody>
          <tr>
            <td><strong>Customer ID</strong></td>
            <td>{receipt.cid}</td>
          </tr>
          <tr>
            <td><strong>Customer Name</strong></td>
            <td>{receipt.customerName}</td>
          </tr>
          <tr>
            <td><strong>Bill ID</strong></td>
            <td>{receipt.billid}</td>
          </tr>
          <tr>
            <td><strong>Amount Paid</strong></td>
            <td>RS {receipt.amount}</td>
          </tr>
          <tr>
            <td><strong>Razorpay Order ID</strong></td>
            <td>{receipt.razorpayOrderId}</td>
          </tr>
          <tr>
            <td><strong>Razorpay Payment ID</strong></td>
            <td>{receipt.razorpayPaymentId}</td>
          </tr>
          <tr>
            <td><strong>Transaction Date</strong></td>
            <td>{new Date(receipt.created_at).toLocaleString()}</td>
          </tr>
        </tbody>
      </table>

      <button onClick={handleDownloadPDF}>📄 Download Reciept PDF</button>
      {/* <button onClick={onClose}>❌ Close</button> */}
    </div>
  );
}

export default Receipt;
