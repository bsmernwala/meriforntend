import React, { useState } from "react";
import Bill from "../Bill/Bill"; // adjust path as needed
import cart  from "./cart.png";

function CheckOutComponent(props) {
  const [showBill, setShowBill] = useState(false);
  const[selitems,setSelItems]=useState(props.data.selitems);
    const[cid,setCId]=useState(props.data.cid);
    const[itemCount,setItemCount]=useState(props.data.itemcount);
    
  const handleCheckOutButton = () => {
    setShowBill(true);
    // On successful payment, clear cart
    setSelItems([]);
    setItemCount(0);
  };

  const handleCloseBill = () => {
    setShowBill(false);
  };

  return (
    <div className="header">
      <div className="cart-container">
        <img src={cart} height="50" width="50" alt="cart" className="cart-icon" />
        <span className="item-count-badge">{props.data.itemcount}</span>
        <button className="btn-checkout" type="button" onClick={handleCheckOutButton}>
          CheckOut
        </button>
      </div>

      {/* {showBill && <Bill onClose={handleCloseBill} />} 
      */}
       {showBill && <Bill data={{selitems,cid}} onClose={handleCloseBill} />}
       {/* // from parent:
<Bill data={{ selitems, cid }} onClose={...} onClearCart={...} /> */}

    </div>
  );
}export default CheckOutComponent;
