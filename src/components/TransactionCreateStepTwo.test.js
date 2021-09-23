import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransactionCreateStepTwo from "./TransactionCreateStepTwo";

test("if amount and note is entered, buttons enabled", async () => {
  //   ARRANGE
  render(<TransactionCreateStepTwo sender={{ id: "10" }} receiver={{ id: "10" }} />);

  //   ASSERTION
  expect(await screen.findByRole("button", { name: /pay/i })).toBeDisabled();
  // since name not specified to TextFields
  //   ACT
  userEvent.type(screen.getByPlaceholderText(/amount/i), "500");
  userEvent.type(screen.getByPlaceholderText(/add a note/i), "dinner");

  //   ASSERTION
  expect(await screen.findByRole("button", { name: /pay/i })).toBeEnabled();
});
