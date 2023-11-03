import React from "react";
import SummaryForm from "./SummaryForm";
import { useOrderDetails } from "../../context/OrderDetails";
 

export default function OrderSummary({ setOrderPhase }) {
  const [optionDetails] = useOrderDetails();

  const scoopArrayKeys = [...optionDetails.scoops.keys()];
  const scoopList = scoopArrayKeys.map((key) => (
    <li key={key}>
      {optionDetails.scoops.get(key)} {key}
    </li>
  ));

  // only display toppings if the toppings total is nonzero

  let toppingsDisplay = null;

  if (!optionDetails.totals.toppings.includes("0.00")) {
    const toppingsArray = [...optionDetails.toppings.keys()];
    const toppingList = toppingsArray.map((key) => <li key={key}>{key}</li>);
    toppingsDisplay = (
      <>
        <h2>Toppings: {optionDetails.totals.toppings}</h2>
        <ul>{toppingList}</ul>
      </>
    );
  }

  return (
    <div>
      <h1>Order Summary</h1>
      <h2>Scoops: {optionDetails.totals.scoops}</h2>
      <ul>{scoopList}</ul>
      {toppingsDisplay}
      <SummaryForm setOrderPhase={setOrderPhase} />
    </div>
  );
}
