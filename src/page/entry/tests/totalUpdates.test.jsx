import { render, screen } from "../../../test-utlis/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";

test("update scoop subtotal when scoop changes", async () => {
  render(<Options optionType="scoops" />);

  // make sure totals start out with $0.00
  // we do not want to match string exact to get element by default exact:true
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoop to 1 and check subtotal
  // it is input where we are adding numbe of scoops and it is spinbutton from reactbootstrap
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  // clear input element before testing , we don't know if something has been set before
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");
  // as one scoop is = $2.00 so as in above line we have added one vanilla scoop so
  // we expect $2.00 in scoopsSubtotal
  expect(scoopsSubtotal).toHaveTextContent("2.00");

  // update chocolate scoop to 2 and check subtotal again
  const chocolateInput = await screen.findByRole("spinbutton", {
    name: "Chocolate",
  });
  userEvent.clear(chocolateInput);
  userEvent.type(chocolateInput, "2");
  expect(scoopsSubtotal).toHaveTextContent("6.00");
});
