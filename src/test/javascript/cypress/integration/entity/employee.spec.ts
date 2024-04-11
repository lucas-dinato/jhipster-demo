import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Employee e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/employees*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('employee');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Employees', () => {
    cy.intercept('GET', '/api/employees*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('employee');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Employee').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Employee page', () => {
    cy.intercept('GET', '/api/employees*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('employee');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('employee');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Employee page', () => {
    cy.intercept('GET', '/api/employees*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('employee');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Employee');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Employee page', () => {
    cy.intercept('GET', '/api/employees*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('employee');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Employee');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Employee', () => {
    cy.intercept('GET', '/api/employees*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('employee');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Employee');

    cy.get(`[data-cy="firstName"]`).type('Vitória', { force: true }).invoke('val').should('match', new RegExp('Vitória'));

    cy.get(`[data-cy="lastName"]`).type('Santos', { force: true }).invoke('val').should('match', new RegExp('Santos'));

    cy.get(`[data-cy="email"]`)
      .type('Emanuelly77@yahoo.com', { force: true })
      .invoke('val')
      .should('match', new RegExp('Emanuelly77@yahoo.com'));

    cy.get(`[data-cy="phoneNumber"]`)
      .type('didactic Krone Teclado', { force: true })
      .invoke('val')
      .should('match', new RegExp('didactic Krone Teclado'));

    cy.get(`[data-cy="hireDate"]`).type('2024-04-11T06:20').invoke('val').should('equal', '2024-04-11T06:20');

    cy.get(`[data-cy="salary"]`).type('74202').should('have.value', '74202');

    cy.get(`[data-cy="commissionPct"]`).type('89868').should('have.value', '89868');

    cy.setFieldSelectToLastOfEntity('manager');

    cy.setFieldSelectToLastOfEntity('department');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/employees*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('employee');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Employee', () => {
    cy.intercept('GET', '/api/employees*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/employees/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('employee');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('employee').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/employees*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('employee');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
