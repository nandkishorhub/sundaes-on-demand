import { render, screen } from "@testing-library/react";
import Options from "../Options";

// here server means mock server not actual server
// here you might notice we haven't added any code of mock service so then
// how we are dealing with mock service for mock data
// Actually when we rendering render(<Options optionType="scoops" />);
// Options component will have api call coded inside it
// but here for test it doesn't call actual server rather it calls
// mock server as we have mock service setup in place in our application
// test itself only deals with mock service worker in that setup file
// that we have configured
test("display image for each scoop from server", async() => {
  render(<Options optionType="scoops" />);

  // find images
  // here name option saying get all images whose AltText ends with scoop
  const scoopImages = await screen.findAllByRole("img", { name: /scoop$/i });
  expect(scoopImages).toHaveLength(2);

  //confirm altText of images
  const altTexts = scoopImages.map((element) => element.alt);
  expect(altTexts).toEqual(["Chocolate scoop", "Vanilla scoop"]);
});
