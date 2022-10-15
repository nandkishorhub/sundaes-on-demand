import { render } from "@testing-library/react";
import { OrderDetailsProvider } from "../context/OrderDetails";

// here "options" can be other render parameters
const renderWithContext = (ui, options) =>
  render(ui, { wrapper: OrderDetailsProvider, ...options });

// re export everything
export * from "@testing-library/react";

//override render method
export { renderWithContext as render };
