import { render, screen } from "../../../test-utlis/testing-library-utils";
import userEvent from "@testing-library/user-event";
import ScoopOption from "../ScoopOption";

test("check scoop input box for invalid value", () => {
  // as ScoopOption accpet two props but here we are sending none
  // reason is we do not need those props for this testing so we avoided
  render(<ScoopOption />);

  //get a spinbutton by role as we would have onyl one spingbutton
  // add invalid value in it ex: -1

  const spinButton = screen.getByRole("spinbutton");
  userEvent.clear(spinButton);
  userEvent.type(spinButton, "-1");
  // reactBootstrap adds class "is-invalid" for invalid input
  // so we have to just assert the class is applied or not
  expect(spinButton).toHaveClass("is-invalid");

  // check for decimal value
  userEvent.clear(spinButton);
  userEvent.type(spinButton, "2.5");
  expect(spinButton).toHaveClass("is-invalid");

  // check for above 10 value
  userEvent.clear(spinButton);
  userEvent.type(spinButton, "11");
  expect(spinButton).toHaveClass("is-invalid");

  //replace with valid input
  userEvent.clear(spinButton);
  userEvent.type(spinButton, "3");
  expect(spinButton).not.toHaveClass("is-invalid");
});
