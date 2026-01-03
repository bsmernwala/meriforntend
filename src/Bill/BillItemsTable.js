import React, { useMemo ,useCallback} from "react";
import "./BillItemsTable.css";

function BillItemsTable({ items, quantities, setQuantities }) {
 const REACT_APP_BASE_API_URL=process.env.REACT_APP_BASE_API_URL;
  const increaseQuantity = useCallback((pid) => {
  setQuantities(prev => ({
    ...prev,
    [pid]: (prev[pid] || 0) + 1,
  }));
}, []);

const decreaseQuantity = useCallback((pid) => {
  setQuantities(prev => {
    const newQty = (prev[pid] || 0) - 1;
    const updated = { ...prev };
    if (newQty <= 0) delete updated[pid];
    else updated[pid] = newQty;
    return updated;
  });
}, []);

  const calculateTotal = (item) => {
    return item.oprice * (quantities[item.pid] || 0);
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => quantities[item.pid] > 0);
  }, [items, quantities]);

  const grandTotal = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + calculateTotal(item), 0);
  }, [filteredItems, quantities]);

  return (
    <div className="bill-table-container">
      <h4 className="bill-header">Bill</h4>
      {filteredItems.length > 0 ? (
        <table className="bill-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Price (₹)</th>
              <th>Photo</th>
              <th>Quantity</th>
              <th>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.pid}>
                <td>{item.pid}</td>
                <td>{item.pname}</td>
                <td>{item.oprice}</td>
                <td>
                  <img
                    src={`${REACT_APP_BASE_API_URL}/product/getproductimage/${item.ppicname}`}
                    height="50"
                    width="50"
                    alt={item.pname}
                  />
                </td>
                <td>
                  <button onClick={() => decreaseQuantity(item.pid)}>-</button>
                  <span style={{ margin: "0 10px" }}>{quantities[item.pid]}</span>
                  <button onClick={() => increaseQuantity(item.pid)}>+</button>
                </td>
                <td>₹{calculateTotal(item)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="5" style={{ textAlign: "right", fontWeight: "bold" }}>
                Grand Total:
              </td>
              <td style={{ fontWeight: "bold" }}>₹{grandTotal}</td>
            </tr>
          </tfoot>
        </table>
      ) : (
        <p style={{ textAlign: "center", color: "gray" }}>No items in the bill.</p>
      )}
    </div>
  );
}

export default BillItemsTable;
