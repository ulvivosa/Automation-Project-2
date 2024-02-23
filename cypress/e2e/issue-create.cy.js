import { faker } from "@faker-js/faker";

describe('Issue create', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.url().should('eq', `${Cypress.env('baseUrl')}project/board`).then((url) => { 
      cy.visit(url + '/board?modal-issue-create=true');
    });
  });

  it('Should create an issue and validate it successfully', () => {

    cy.get('[data-testid="modal:issue-create"]').within(() => { 
      cy.get('.ql-editor').type('My bug description');
      cy.get('.ql-editor').should('have.text', 'My bug description');
      cy.get('input[name="title"]').type('Bug');
      cy.get('input[name="title"]').should('have.value', 'Bug');
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]')
        .wait(1000)
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="icon:bug"]').should('be.visible');
      cy.get('[data-testid="form-field:reporterId"]').should('be.visible').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').should('be.visible') .click();
      cy.get('[data-testid="form-field:priority"]').should('be.visible') .click();
      cy.get('[data-testid="select-option:Highest"]').should('be.visible') .click();
      cy.get('button[type="submit"]').click();
    });
    cy.get('[data-testid="modal:issue-create"]').should('not.exist');
    cy.contains('Issue has been successfully created.').should('be.visible');
  
    cy.reload();
    cy.contains('Issue has been successfully created.').should('not.exist');

    cy.get('[data-testid="board-list:backlog"]').should('be.visible').and('have.length', '1').within(() => {
      cy.get('[data-testid="list-issue"]')
          .should('have.length', '5')
          .first()
          .find('p')
          .contains("Bug")
          .siblings()
          .within(() => {
            cy.get('[data-testid="icon:bug"]').should('be.visible');
          });
    });

  it('Should create 2 issues with random and validate them successfully', () => {
    const randomTitle = faker.random.word();
    const randomDescription = faker.lorem.words();

    cy.get('[data-testid="modal:issue-create"]').within(() => { 
      cy.get('input[name="title"]').type('randomTitle');
      cy.get('input[name="title"]').should('have.lenght', 1);
      cy.get('.ql-editor').type('randomDescription');
      cy.get('.ql-editor').should('have.lenght', 7);
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Task"]')
        .wait(1000)
        .trigger('mouseover')
        .trigger('click');
      cy.get('[data-testid="icon:task"]').should('be.visible');
      cy.get('[data-testid="form-field:reporterId"]').should('be.visible').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').should('be.visible') .click();
      cy.get('[data-testid="form-field:priority"]').should('be.visible') .click();
      cy.get('[data-testid="select-option:Low"]').should('be.visible') .click();
      cy.get('button[type="submit"]').click();
    });
  });

  it('Should validate title is required field if missing', () => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('button[type="submit"]').click();
      cy.get('[data-testid="form-field:title"]').should('contain', 'This field is required');
    });
  });
})})
