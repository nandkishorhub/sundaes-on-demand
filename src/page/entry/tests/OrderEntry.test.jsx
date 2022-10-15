import {
  findByRole,
  render,
  screen,
  waitFor,
} from "../../../test-utlis/testing-library-utils";
import OrderEntry from "../OrderEntry";
import { rest } from "msw";
import { server } from "../../../mocks/server";
import userEvent from "@testing-library/user-event";

test("handles errors for scoops and toppings routes", async () => {
  // here in this particular test we have job to test/mock/check errors for scoops
  // & toppings endpoint, so here we have overridden these endpoint in order to
  // throw erros
  server.resetHandlers(
    rest.get("http://localhost:3030/scoops", (req, res, ctx) => {
      return res(ctx.status(500));
    }),
    rest.get("http://localhost:3030/toppings", (req, res, ctx) => {
      return res(ctx.status(500));
    })
  );

  // here in order to avoid any tentive erros
  // we have passed mock function to setOrderPhase
  // here we are just testing for error so anyway this prop
  // doesn;t have much imp but sometime we might get test error of not finding
  // prop function in code so to avoid that we have passed mock function
  render(<OrderEntry setOrderPhase={jest.fn()} />);
  // here with the below code sometimes we get an error saying alert not found
  // and it is very interesting here to find out why it is doing so
  // reason is we expecting error/alert asynchrously from two options
  // one is scoops and other is toppings , it means we are getting two alerts
  // which is one after another and that is asychousnly so actually what happening here is
  // await api here waiting for alerts to be in document so once first alert it recicves it is satiiesying
  // and moving ahead but for second alert we are not getting anything as it is not waiting for second alert

  // const alerts = await screen.findAllByRole("alert", {
  //   name: "An unexpected error occured, please try again later",
  // });

  // here waitFor will wait to resolve all promises
  // use waitFor for tests where await findBy is not enough
  // for safer side we have wrapped that inside waitFor
  await waitFor(async () => {
    // here you might have observed we are not finding alerts by name
    // reactBootStrap laert doesn't support name value
    // for more infor check this link => https://www.udemy.com/course/react-testing-library/learn/lecture/32177920#overview

    const alerts = await screen.findAllByRole("alert");
    expect(alerts).toHaveLength(2);
  });
});

test("Order button disable if no scoops added", async () => {
  // here there is no need to pass mock function here
  // but we have added to avoid any errors for tyepScript
  render(<OrderEntry setOrderPhase={jest.fn()} />);

  const scoopSubtotal = screen.getByText(/Scoops total:/i);
  expect(scoopSubtotal).toHaveTextContent("0.00");

  const orderButton = screen.getByRole("button", { name: /order sundae/i });
  expect(orderButton).toBeDisabled();

  const vanillaInput = await screen.findByRole("spinbutton", {
    name: "Vanilla",
  });

  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, "1");
  expect(scoopSubtotal).toHaveTextContent("2.00");
  expect(orderButton).toBeEnabled();
});
