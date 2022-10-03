import { render, screen, fireEvent } from "@testing-library/react";
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
  render(<SummaryForm />);
  const checkbox = screen.getByRole("checkbox", {
    name: /terms and conditions/i,
  });
  const confirmButton = screen.getByRole("button", { name: /confirm order/i });

  fireEvent.click(checkbox);
  expect(confirmButton).toBeEnabled();

  fireEvent.click(checkbox);
  expect(confirmButton).toBeDisabled();
});
