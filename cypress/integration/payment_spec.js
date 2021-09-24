const { v4: uuidv4 } = require("uuid");

describe("payment", () => {
  it("user can make payment", () => {
    /*
            Test planning for payment 
            1) Login 
            2) check account balance 
            3) click on new button 
            4) search for user 
            5) add amount and note and click pay
            6) return to transactions
            7) go to personal payments: MINE 
            8) click on payment : to get transaction detail
            9) verify if payment was made , verify payment amount was deducted
        */

    // LOGIN
    cy.visit("/");
    cy.findByRole("textbox", { name: /username/i }).type("johndoe");
    cy.findByLabelText(/password/i).type("s3cret");
    cy.findByRole("checkbox", { name: /remember me/i }).check();
    cy.findByRole("button", { name: /sign in/i }).click();

    //   CHECK ACCOUNT BALANCE
    let oldBalance;
    cy.get(`[data-test=sidenav-user-balance]`).then(($balance) => (oldBalance = $balance.text()));

    // CLICK NEW BUTTON
    cy.get("[data-test=nav-top-new-transaction]").click();

    // SEARCH FOR USER
    cy.get("[data-test=user-list-search-input]").type("doven becker");
    cy.get("[data-test=user-list-item-tsHF6_D5oQ]").click();

    // ADD AMOUNT AND NOTE & PAY
    const amountPayed = "5.00";
    cy.get("#amount").type(amountPayed);
    const note = uuidv4();
    cy.get("#transaction-create-description-input").type(note);
    cy.findByRole("button", { name: /pay/i }).click();

    // RETURN TO TRANSACTIONS
    cy.findByRole("button", { name: /return to transactions/i }).click();

    // GO TO PERSONAL PAYMENTS : MINE
    cy.findByRole("tab", { name: /mine/i }).click();

    // CLICK ON PAYMENT TO GET TRANSACTION DETAIL
    cy.findByText(note).click({ force: true });

    // VERIFY IF THE PAYMENT WAS MADE
    cy.findByText(`-$${amountPayed}`).should("be.visible");
    cy.findByText(note).should("be.visible");

    // CHECK FOR BALANCE
    cy.get(`[data-test=sidenav-user-balance]`).then(($balance) => {
      const convertedOldBalance = parseFloat(oldBalance.replace(/\$|,/g, ""));
      const convertedNewBalance = parseFloat($balance.text().replace(/\$|,/g, ""));

      expect(convertedOldBalance - convertedNewBalance).to.equal(parseFloat(amountPayed));
    });
  });
});
