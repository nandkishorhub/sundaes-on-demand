import {
  render,
  screen,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SummaryForm from "../SummaryForm";

test("initial conditions", () => {
  render(<SummaryForm />);
  const checobox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  expect(checobox).not.toBeChecked();
  const confirmButton = screen.getByRole("button", { name: /confirm order/i });
  expect(confirmButton).toBeDisabled();
});

test("Checkbox enables button on first click and disbales on second click", () => {
  render(<SummaryForm setOrderPhase={jest.fn()} />);
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const confirmButton = screen.getByRole("button", { name: /confirm order/i });

  userEvent.click(checkbox);
  expect(confirmButton).toBeEnabled();

  userEvent.click(checkbox);
  expect(confirmButton).toBeDisabled();
});

test("popover reponds to hover", async () => {
  render(<SummaryForm />);

  // initially popover is not on the page
  // as  elements is not on the page so in that case use "query" of screen object
  // here popover is not "display:hidden",  it is actually not present on the page

  const nullPopover = screen.queryByText(
    /No ice cream will actually be delivered/i
  );
  // here queryByText returns null if it not found and return node if found
  // it does not throw error directly if not found
  expect(nullPopover).not.toBeInTheDocument();

  // popover appears upon mousehover of checkbox label
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  userEvent.hover(termsAndConditions);
  // Here this time we are expecting popover to be in the page so we use getByText
  const popover = screen.getByText(/No ice cream will actually be delivered/i);
  expect(popover).toBeInTheDocument();

  // popover disappears when mouse out
  userEvent.unhover(termsAndConditions);

  // Here if we write below code to check whether poover is removed or not
  // after unhover , but below code will fail the test
  // reason is react removes popver asynchonously so it still get popover in page and
  // test gets failed, so to overcome this problem we have written solution for waiting
  // that popver to be removed from dcoument
  // const nullPopoverAgain = screen.queryByText(
  //   /No ice cream will actually be delivered/i
  // );
  //  expect(nullPopover).not.toBeInTheDocument();

  // here popover is getting removed asynchornouly
  // so we have to wait for element to be removed from document
  await waitForElementToBeRemoved(() =>
    screen.queryByText(/No ice cream will actually be delivered/i)
  );
});
