import { cleanup, render, screen } from "@testing-library/react";
import App from "./App";

afterEach(cleanup);

it("renders text in home page", () => {
  render(<App />);
  const linkElement = screen.getByTestId("home-text");
  expect(linkElement).toBeInTheDocument();
});
