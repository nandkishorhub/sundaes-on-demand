import userEvent from "@testing-library/user-event";
import { render, screen } from "../../../test-utlis/testing-library-utils";
import Options from "../Options";

// here server means mock server not actual server
// here you might notice we haven't added any code of mock service so then
// how we are dealing with mock service for mock data
// Actually when we rendering render(<Options optionType="scoops" />);
// Options component will have api call coded inside it
// but here for test it doesn't call actual server rather it calls
// mock server as we have mock service setup (src/mocks) in place in our application
// test itself only deals with mock service worker in that setup file
// that we have configured
test("display image for each scoop from server", async () => {
  render(<Options optionType="scoops" />);

  // find images
  // here name option saying get all images whose AltText ends with scoop
  // when there async data fetching in code so always use await findBy to get
  // data in tests
  // here for img role name option means we are querying it based on image alt text
  // which ends with scoop
  const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
  expect(scoopImages).toHaveLength(2);

  //confirm alt text of images
  const altTexts = scoopImages.map((element) => element.alt);
  expect(altTexts).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});

test("display image for each topping from server", async () => {
  render(<Options optionType="toppings" />);

  const toppingImages = await screen.findAllByRole("img", {
    name: /topping$/i,
  });
  expect(toppingImages).toHaveLength(3);

  // confirm alt text of topping images
  const altTexts = toppingImages.map((element) => element.alt);
  expect(altTexts).toEqual([
    "Cherries topping",
    "M&Ms topping",
    "Hot fudge topping",
  ]);
});

test("Do not update scoops subtotal for invalid input", async () => {
  render(<Options optionType="scoops" />);

  // add invalid value for scoop
  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });
  userEvent.clear(vanillaInput);
  userEvent.click(vanillaInput, "-1");

  // check scoop subtoal is still zero not updated by invalid input
  const scoopSubtotal = screen.getByText(/Scoops total:/i);
  expect(scoopSubtotal).toHaveTextContent("0.00");

  // now add valid input and check scoopsubtotal updated accordingly or not
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");
  expect(scoopSubtotal).toHaveTextContent("2.00");
});
