import { render, waitFor } from "@testing-library/react";
import OrderEntry from "../page/entry/OrderEntry";

//To handle context error when component rendered without wrapping
// inside context provider

test("Handle Context error", async () => {
  jest.spyOn(console, "error").mockImplementation(() => jest.fn());
  // We could have written only <OrderEntry setOrderPhase={jest.fn()} with toThrow() 
  // but jsdom test console shows that unhandled error so in order to avoid that
  // we have added it inside waitfor and spied on console which is above code
  await waitFor(() =>
    expect(() => render(<OrderEntry setOrderPhase={jest.fn()} />)).toThrow(
      "useOrderDetails must be used within an OrderDetailsProvider"
    )
  );
  jest.restoreAllMocks();
});
