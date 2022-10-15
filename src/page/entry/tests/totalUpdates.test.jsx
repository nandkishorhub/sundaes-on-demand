import { render, screen } from "../../../test-utlis/testing-library-utils";
import userEvent from "@testing-library/user-event";
import Options from "../Options";
import OrderEntry from "../OrderEntry";

test("update scoop subtotal when scoop changes", async () => {
  render(<Options optionType="scoops" />);

  // make sure totals start out with $0.00
  // we do not want to match string exact to get element, by default exact:true
  const scoopsSubtotal = screen.getByText("Scoops total: $", { exact: false });
  // toHaveTextContent check whether given string is contain or not
  expect(scoopsSubtotal).toHaveTextContent("0.00");

  // update vanilla scoop to 1 and check subtotal
  // it is input where we are adding numbe of scoops and it is spinbutton from reactbootstrap
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  // clear input element before testing , we don't know if something has been set before
  userEvent.clear(vanillaInput);
  // Here with the help of type method we able to set 2 as value of spinbutton
  // type method force this value to be passed as a string
  // In code while setting this , make sure to parse value to int/number
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

test("update topping subtotal when topping selected", async () => {
  render(<Options optionType="toppings" />);

  // make sure total topping initially $0.00
  const toppingsSubTotal = screen.getByText("Toppings total: $", {
    exact: false,
  });
  expect(toppingsSubTotal).toHaveTextContent("0.00");

  //select/check cherries toppings
  const cherriesInput = await screen.findByRole("checkbox", {
    name: "Cherries",
  });

  userEvent.click(cherriesInput);
  //as one topping is = $1.50 so as in above line we have added one Cherries toppping so
  // we expect $1.50 in toppingsSubTotal
  expect(toppingsSubTotal).toHaveTextContent("1.50");

  // select another topping ex. Hot Fudge
  const hotFundgeInput = await screen.findByRole("checkbox", {
    name: "Hot fudge",
  });

  userEvent.click(hotFundgeInput);
  expect(toppingsSubTotal).toHaveTextContent("3.00");

  // now uncheck both checkBoxes and check toppingSubtotal reset to 0.00
  userEvent.click(cherriesInput);
  userEvent.click(hotFundgeInput);

  expect(toppingsSubTotal).toHaveTextContent("0.00");
});

describe("Grand Totoal", () => {
  test("check grantotal when user select scoops first", async () => {
    render(<OrderEntry />);
    const scoopInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    const grandTotalInput = screen.getByRole("heading", {
      name: /Grand total:/i,
    });

    expect(grandTotalInput).toHaveTextContent("0.00");

    userEvent.clear(scoopInput);
    userEvent.type(scoopInput, "1");

    expect(grandTotalInput).toHaveTextContent("2.00");
  });

  test("check grantotal when user select toppings first", async () => {
    render(<OrderEntry />);
    const toppingInput = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    userEvent.click(toppingInput);

    const grandTotalInput = screen.getByRole("heading", {
      name: /Grand total:/i,
    });
    expect(grandTotalInput).toHaveTextContent("1.50");
  });

  test("check grandtotal when both topping and scoops selcted", async () => {
    render(<OrderEntry />);
    const vanillaInput = await screen.findByRole("spinbutton", {
      name: "Vanilla",
    });
    const grandTotalInput = screen.getByRole("heading", {
      name: /Grand total:/i,
    });

    userEvent.clear(vanillaInput);
    userEvent.type(vanillaInput, "1");

    const toppingInput = await screen.findByRole("checkbox", {
      name: "Cherries",
    });
    userEvent.click(toppingInput);

    expect(grandTotalInput).toHaveTextContent("3.50");
  });
});
