import { faker } from "@faker-js/faker";

describe("Time tracking", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.url()
        .should("eq", `${Cypress.env("baseUrl")}project/board`)
        .then((url) => {
          cy.visit(url + "/board");
          cy.contains("This is an issue of type: Task.").click();
        });
    });
const getIssueDetailsModal = () =>cy.get('[data-testid="modal:issue-details"]');
const getCreateIssue = () => cy.get('[data-testid="modal:issue-create"]');
const issueClickFirst = () =>cy.get('[data-testid="list-issue"]').eq(0).click();
const taskDescription = faker.lorem.sentence ();
const shortSummary = faker.lorem.sentences ();
const closeButton = () => cy.get('[data-testid="icon:close"]').click();
const stopWatch = () => cy.get('[data-testid="icon:stopwatch"]');
const estimatedTime = () => cy.get('input[placeholder="Number"]');
const timeTrackNumber = () => cy.get('input[placeholder="Number"]');
const timeTrackWindow = () => cy.get('[data-testid="modal:tracking"]');


it("Creating issue", () => {
  getCreateIssue().within(() => {
    cy.get(".ql-editor").type(taskDescription);
    cy.get(".ql-editor").should("have.text", taskDescription);
    cy.get('input[name="title"]').type(shortSummary).should("have.value", shortSummary);
    cy.get('button[type="submit"]').click();
  });
  cy.contains("Issue has been successfully created.").should("be.visible");

  getIssueDetailsModal().should("be.visible").within(() => {
      stopWatch().should("have.text", "No time logged");
      estimatedTime().click().type(10);
      closeButton();
      getIssueDetailsModal().should("not.exist");
    });
  issueClickFirst();
  getIssueDetailsModal().should("be.visible").within(() => {
      estimatedTime().should("have.value", 10);
      stopWatch().should("have.text", "10h estimated");

      estimatedTime().clear().click().type(20);
      closeButton();
      getIssueDetailsModal().should("not.exist");
    });
  issueClickFirst();
  getIssueDetailsModal().should("be.visible").within(() => {
      estimatedTime().should("have.value", 20);
      stopWatch().next().should("have.text", "20h estimated");
      estimatedTime().click().clear();
      closeButton();
      getIssueDetailsModal().should("not.exist");
    });
  issueClickFirst();
  getIssueDetailsModal().should("be.visible").within(() => {
      cy.get("input").should("have.attr", "placeholder", "Number");
    });
});

it("Update time, remove logged time", () => {
  getIssueDetailsModal().should("be.visible").within(() => {
      stopWatch().should("have.text", "No time logged");
      estimatedTime().click().type(10);
      stopWatch().click();
    });
  timeTrackWindow().should("be.visible").within(() => {
      cy.contains("Time spent (hours)");
      timeTrackNumber().first().type(2);
      timeTrackNumber().last().type(5);
      cy.contains("Done").click();
    });
  getIssueDetailsModal().within(() => {
    stopWatch().should("not.have.text", "No time logged");
    cy.contains("div", "2h logged").should("be.visible");
    cy.contains("div", "5h remaining").should("be.visible");
    stopWatch().click();
  });
  timeTrackWindow().should("be.visible").within(() => {
      cy.contains("Time spent (hours)");
      timeTrackNumber().first().clear();
      timeTrackNumber().last().clear();
      cy.contains("Done").click();
    });
  getIssueDetailsModal().within(() => {
    stopWatch().should("contain", "No time logged");
    estimatedTime().should("have.value", 10);
    stopWatch().should("contain", "10h estimated");
  });
});
});
