import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../App";

// Here in this file , we have tests to test entire application flow end to end

test("order phases for happy path", async () => {
  // render app
  // here there is no need to wrap in provider because app component has provider
  // ; already wrapped!
  render(<App />);
  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");

  // here no need to await , as vanila has shown up alread in above line
  // then Chocolate must have been there
  // because both resolves thorugh same end point
  const chocolateInput = screen.getByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");

  /// here i have to await as end point for toppings is different and it is nt resolved yet
  const cherriesInput = await screen.findByRole("checkbox", {
    name: "Cherries",
  });

  userEvent.click(cherriesInput);

  // find and click order button
  const OrderSummaryButton = screen.getByRole("button", {
    name: /order sundae/i,
  });
  userEvent.click(OrderSummaryButton);

  // check summary information based on order
  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $6.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole("heading", {
    name: "Toppings: $1.50",
  });
  expect(toppingsHeading).toBeInTheDocument();

  // check summary options items
  //   expect(screen.getByText("1 Vanilla")).toBeInTheDocument();
  //   expect(screen.getByText("2 Chocolate")).toBeInTheDocument();
  //   expect(screen.getByText("Cherries")).toBeInTheDocument();

  // accept terms and conditions and click button to confirm order
  const tcCheckbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  userEvent.click(tcCheckbox);

  const confirmationButton = screen.getByRole("button", {
    name: /confirm order/i,
  });
  userEvent.click(confirmationButton);

  // check loading shows
  const loadingInput = screen.getByText("Loading");
  expect(loadingInput).toBeInTheDocument();

  // confirm order number number on confirmation page
  // check confirmation page text
  // this one is async because here post call to servers gooes
  const thankYouHeader = await screen.findByRole("heading", {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  // to check anything which is not in the document use queryBy
  const loadingInputAgain = screen.queryByText("Loading");
  expect(loadingInputAgain).not.toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // click "new order" button on confirmation page
  const newOrderButton = screen.getByRole("button", { name: /new order/i });
  userEvent.click(newOrderButton);

  // check that scoops and toppinng subtotal have been reset
  const scoopsTotal = await screen.findByText("Scoops total: $0.00");
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = screen.getByText("Toppings total: $0.00");
  expect(toppingsTotal).toBeInTheDocument();

  // wait for items to appear so that testing librray does not upset about stuff
  // happening after test is over
  // to avoid all warning of wrapping in act
  await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  await screen.findByRole("checkbox", {
    name: "Cherries",
  });
});

test("check toppings is not there on summary page if not selected on entry page", async () => {
  render(<App />);

  // first add any scoop
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");

  // find and click order button
  const OrderSummaryButton = screen.getByRole("button", {
    name: /order sundae/i,
  });
  userEvent.click(OrderSummaryButton);

  // here check whether scoops with subtotal present and topping not
  const summaryHeading = screen.getByRole("heading", { name: "Order Summary" });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = screen.getByRole("heading", { name: "Scoops: $2.00" });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.queryByRole("heading", {
    name: /toppings/i,
  });
  expect(toppingsHeading).not.toBeInTheDocument();
});
