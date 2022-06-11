import faker from "@faker-js/faker";

describe("smoke tests", () => {
  afterEach(() => {
    cy.cleanupUser();
  });

  it("should allow you to register and login", () => {
    const loginForm = {
      email: `${faker.internet.userName()}@example.com`,
      password: faker.internet.password(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    };
    cy.then(() => ({ email: loginForm.email })).as("user");

    cy.visit("/join");
    // cy.findByRole("link", { name: /sign up/i }).click();

    cy.findByRole("textbox", { name: /email/i }).type(loginForm.email);
    cy.findByLabelText("Password").type(loginForm.password);
    cy.findByLabelText(/confirm password/i).type(loginForm.password);
    cy.findByRole("textbox", { name: /first name/i }).type(loginForm.firstName);
    cy.findByRole("textbox", { name: /last name/i }).type(loginForm.lastName);
    cy.findByRole("button", { name: /create account/i }).click();

    cy.findByRole("link", { name: /challenges/i }).click();
    // cy.visit("/challenges");
    // cy.findByRole("button", {
    //   name: `avatar ${loginForm.firstName} ${loginForm.lastName}`,
    // }).click();
    cy.findByRole("button", { name: /logout/i }).click();
    // cy.findByRole("link", { name: /log in/i });
  });

  // it("should allow you to make a note", () => {
  //   const testNote = {
  //     title: faker.lorem.words(1),
  //     body: faker.lorem.sentences(1),
  //   };
  //   cy.login();
  //   cy.visit("/notes");

  //   // cy.findByRole("link", { name: /notes/i }).click();
  //   cy.findByText("No notes yet");

  //   cy.findByRole("link", { name: /\+ new note/i }).click();

  //   cy.findByRole("textbox", { name: /title/i }).type(testNote.title);
  //   cy.findByRole("textbox", { name: /body/i }).type(testNote.body);
  //   cy.findByRole("button", { name: /save/i }).click();

  //   cy.findByRole("button", { name: /delete/i }).click();

  //   cy.findByText("No notes yet");
  // });
});
