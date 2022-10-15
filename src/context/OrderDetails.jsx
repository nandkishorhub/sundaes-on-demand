import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { pricePeritem } from "../constants";

// format currency to two digit decimal ex: $0.00
export function formatCurrency(currency) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(currency);
}
const OrderDetails = createContext();

// create custom hook to check whether we're inside a provider
export function useOrderDetails() {
  const context = useContext(OrderDetails);
  if (!context) {
    throw new Error(
      "useOrderDetails must be used within an OrderDetailsProvider"
    );
  }
  return context;
}

function calculateSubtotal(optionType, optionCounts) {
  let optionCount = 0;
  for (const count of optionCounts[optionType].values()) {
    optionCount += count;
  }

  return optionCount * pricePeritem[optionType];
}

export function OrderDetailsProvider(props) {
  const [optionCounts, setOptionCounts] = useState({
    scoops: new Map(),
    toppings: new Map(),
  });
  const zeroCurrency = formatCurrency(0);
  const [totals, setTotals] = useState({
    scoops: zeroCurrency,
    toppings: zeroCurrency,
    grandTotal: zeroCurrency,
  });

  useEffect(() => {
    const scoopsSubtotal = calculateSubtotal("scoops", optionCounts);
    const toppingsSubtotal = calculateSubtotal("toppings", optionCounts);
    const grandTotal = scoopsSubtotal + toppingsSubtotal;
    setTotals({
      scoops: formatCurrency(scoopsSubtotal),
      toppings: formatCurrency(toppingsSubtotal),
      grandTotal: formatCurrency(grandTotal),
    });
  }, [optionCounts]);

  const value = useMemo(() => {
    function updateItemCount(itemName, newItemCount, optionType) {
      // make a copy of the current option counts, so as not to mutate in place
      const newOptionCounts = { ...optionCounts };
      const optionsCountsMap = optionCounts[optionType];
      optionsCountsMap.set(itemName, parseInt(newItemCount));
      setOptionCounts(newOptionCounts);
    }

    const resetOrder = () => {
      setOptionCounts({
        scoops: new Map(),
        toppings: new Map(),
      });
    };
    return [{ ...optionCounts, totals }, updateItemCount, resetOrder];
  }, [optionCounts, totals]);

  return (
    <OrderDetails.Provider value={value}>
      {props.children}
    </OrderDetails.Provider>
    // we can use below syntax also both are doing same job
    //<OrderDetails.Provider value={value} {...props} />;
  );
}
