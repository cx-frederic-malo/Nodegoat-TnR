/// <reference types="Cypress" />

describe("/contributions behaviour", () => {
  "use strict";

  before(() => {
    cy.dbReset();
  });

  afterEach(() => {
    cy.visitPage("/logout");
  });

  it("Should redirect if the user has not logged in", () => {
    cy.visitPage("/contributions");
    cy.url().should("include", "login");
  });

  it("Should be accesible for a logged user", () => {
    cy.userSignIn();
    cy.visitPage("/contributions");
    cy.url().should("include", "contributions");
  });

  it("Should be a table with several inputs", () => {
    cy.userSignIn();
    cy.visitPage("/contributions");
    cy.get("table")
      .find("input")
      .should("have.length", 3);
  });

  it("Should input be modified", () => {
    const value = "12";
    cy.userSignIn();
    cy.visitPage("/contributions");
    cy.get("table")
      .find("input")
      .first()
      .clear()
      .type(value);

    cy.get("button[type='submit']")
      .click();

    cy.get("tbody > tr > td")
      .eq(1)
      .contains(`${value} %`);

    cy.get(".alert-success")
      .should("be.visible");

    cy.url().should("include", "contributions");
  });

  // Security regression tests for CWE-94 Code Injection (eval() replaced with parseInt())
  // These tests verify that user-supplied input to contribution fields cannot be used
  // to inject and execute arbitrary server-side JavaScript code.

  it("Should reject JavaScript expression injection in preTax field", () => {
    // An attacker might try to pass a JS expression like "1+1" that eval() would execute.
    // parseInt() returns NaN for such input, and the form should show a validation error.
    cy.userSignIn();
    cy.visitPage("/contributions");
    cy.get("table")
      .find("input")
      .eq(0)
      .clear()
      .type("1+1");

    cy.get("button[type='submit']")
      .click();

    cy.get(".alert-danger")
      .should("be.visible")
      .and("contain", "Invalid");
  });

  it("Should reject JavaScript code injection string in afterTax field", () => {
    // Attempt to pass a JS function call expression; eval() would execute it,
    // but parseInt() treats it as NaN, triggering the validation error path.
    cy.userSignIn();
    cy.visitPage("/contributions");
    cy.get("table")
      .find("input")
      .eq(1)
      .clear()
      .type("process.exit(1)");

    cy.get("button[type='submit']")
      .click();

    cy.get(".alert-danger")
      .should("be.visible")
      .and("contain", "Invalid");
  });

  it("Should reject JavaScript code injection string in roth field", () => {
    // Verify the roth field is also protected against eval-based code injection.
    cy.userSignIn();
    cy.visitPage("/contributions");
    cy.get("table")
      .find("input")
      .eq(2)
      .clear()
      .type("require('child_process').execSync('id')");

    cy.get("button[type='submit']")
      .click();

    cy.get(".alert-danger")
      .should("be.visible")
      .and("contain", "Invalid");
  });

  it("Should reject negative numeric values", () => {
    // Negative values should be treated as invalid by the existing validation logic.
    cy.userSignIn();
    cy.visitPage("/contributions");
    cy.get("table")
      .find("input")
      .eq(0)
      .clear()
      .type("-5");

    cy.get("button[type='submit']")
      .click();

    cy.get(".alert-danger")
      .should("be.visible")
      .and("contain", "Invalid");
  });

  it("Should reject contribution total exceeding 30%", () => {
    // Ensure the >30% business rule is still enforced after the fix.
    cy.userSignIn();
    cy.visitPage("/contributions");
    const inputs = cy.get("table").find("input");
    inputs.eq(0).clear().type("11");
    inputs.eq(1).clear().type("11");
    inputs.eq(2).clear().type("11");

    cy.get("button[type='submit']")
      .click();

    cy.get(".alert-danger")
      .should("be.visible")
      .and("contain", "30");
  });

  it("Should accept valid integer contribution values", () => {
    // Confirm that legitimate integer inputs still work correctly after the fix.
    cy.userSignIn();
    cy.visitPage("/contributions");
    cy.get("table")
      .find("input")
      .eq(0)
      .clear()
      .type("10");

    cy.get("table")
      .find("input")
      .eq(1)
      .clear()
      .type("5");

    cy.get("table")
      .find("input")
      .eq(2)
      .clear()
      .type("5");

    cy.get("button[type='submit']")
      .click();

    cy.get(".alert-success")
      .should("be.visible");

    cy.url().should("include", "contributions");
  });

  it("Should reject non-numeric string input", () => {
    // Strings like 'abc' are not valid contribution percentages.
    // parseInt('abc') returns NaN, so the validation error must be shown.
    cy.userSignIn();
    cy.visitPage("/contributions");
    cy.get("table")
      .find("input")
      .eq(0)
      .clear()
      .type("abc");

    cy.get("button[type='submit']")
      .click();

    cy.get(".alert-danger")
      .should("be.visible")
      .and("contain", "Invalid");
  });
});
