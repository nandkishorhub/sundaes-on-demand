import React, { useEffect, useState } from "react";
import axios from "axios";
import ScoopOption from "./ScoopOption";
import ToppingOption from "./ToppingOption";
import { Row } from "react-bootstrap";
import AlertBanner from "../common/AlertBanner";
import { pricePeritem } from "../../constants";
import { useOrderDetails } from "../../context/OrderDetails";
export default function Options({ optionType }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [OrderDetails, updateItemCount] = useOrderDetails();

  //optionType can be 'scoops' or 'toppings'
  useEffect(() => {
    axios
      .get(`http://localhost:3030/${optionType}`)
      .then((response) => setItems(response.data))
      .catch((error) => setError(true));
  }, [optionType]);

  if (error) {
    return <AlertBanner />;
  }

  const ItemComponent = optionType === "scoops" ? ScoopOption : ToppingOption;
  const title = optionType[0].toUpperCase() + optionType.slice(1).toLowerCase();

  const optionItems = items.map((item) => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
      // here we are sending updateItemCount as a prop with
      // optionType param set from here as this param is availale here only
      // updateItemCount={(itemName, newItemCount) =>
      //   updateItemCount(itemName, newItemCount, optionType)
      // }
    />
  ));

  return (
    <>
      <h2>{title}</h2>
      <p>{pricePeritem[optionType]} each</p>
      <p>
        {title} total: {OrderDetails.totals[optionType]}
      </p>
      <Row>{optionItems}</Row>;
    </>
  );
}
