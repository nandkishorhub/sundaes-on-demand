import { render, screen, waitFor } from "../../../test-utlis/testing-library-utils"
import OrderEntry from "../OrderEntry";
import { rest } from "msw";
import { server } from "../../../mocks/server";

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

  render(<OrderEntry />);
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
