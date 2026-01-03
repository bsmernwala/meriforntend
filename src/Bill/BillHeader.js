
import React from "react";

function BillHeader({ cid, custDetails, date }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h3 style={{ backgroundColor: "#f0f0f0", padding: "10px" }}>Customer Billing Info</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
        <tbody>
          <tr>
            <td><strong>Customer ID</strong></td>
            <td>{cid}</td>
          </tr>
          <tr>
            <td><strong>Name</strong></td>
            <td>{custDetails.CustomerName}</td>
          </tr>
          <tr>
            <td><strong>Address</strong></td>
            <td>{custDetails.CAddress}</td>
          </tr>
          <tr>
            <td><strong>Contact</strong></td>
            <td>{custDetails.CContact}</td>
          </tr>
          <tr>
            <td><strong>Bill Date</strong></td>
            <td>{date}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default BillHeader;
