import React from "react";
import Button from "react-bootstrap/Button";
import Options from "./Options";
import { useOrderDetails } from "../../context/OrderDetails";

export default function OrderEntry({ setOrderPhase }) {
  const [OrderDetails] = useOrderDetails();
   
  // disable order button if there aren't any scoops in order
  const orderDisabled = OrderDetails.totals["scoops"].includes("0.00");
  return (
    <>
      <Options optionType="scoops" />
      <Options optionType="toppings" />
      <h2>Grand total: {OrderDetails.totals["grandTotal"]}</h2>
      <Button disabled={orderDisabled} onClick={() => setOrderPhase("review")}>
        Order Sundae!
      </Button>
    </>
  );
}
