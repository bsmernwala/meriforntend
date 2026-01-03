import React, { useEffect, useState } from "react";
import axios from "axios";

function Sales({ vender }) {
  const [sales, setSales] = useState([]);
  const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
//alert("venderid sales="+vender.Vid)
  useEffect(() => {
    if (vender && vender.Vid) {
      axios
        .get(`${REACT_APP_BASE_API_URL}/sales/vender/${vender.Vid}`)
        .then((res) => setSales(res.data))
        .catch((err) => console.error(err));
    }
  }, [vender]);

  return (
    <div style={{ margin: 20 }}>
      <h3>Sales Details</h3>
      {sales.length === 0 ? (
        <p>No sales yet</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Product Id</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale._id}>
                <td>{new Date(sale.date).toLocaleString()}</td>
                <td>{sale.productId}</td>
                 <td>{sale.product?.pname}</td>
                <td>{sale.quantity}</td>
                <td>₹{sale.totalPrice}</td>
               
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Sales;
