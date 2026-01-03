
import React from "react";

function BillSummary({ total, isPaid, onPay, onDownload }) {
  return (
    <div className="bill-summary">
      <h4 style={{ backgroundColor: "green", color: "white" }}>
        Total Amount = ₹{total}
      </h4>
      {isPaid ? (
        <>
          <h4 style={{ color: "green" }}>Payment Completed ✅</h4>
          <button onClick={onDownload}>Download PDF</button>
        </>
      ) : (
        <button onClick={onPay}>Pay Now</button>
      )}
    </div>
  );
}

export default BillSummary;
