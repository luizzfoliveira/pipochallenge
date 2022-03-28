import { cleanup, render, screen } from "@testing-library/react";
import App from "./Home";

afterEach(cleanup);

it("renders text in home page", () => {
  render(<App />);
  const linkElement = screen.getByTestId("home-text");
  expect(linkElement).toBeInTheDocument();
});
