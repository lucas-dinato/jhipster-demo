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

describe('JobHistory e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/job-histories*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('job-history');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load JobHistories', () => {
    cy.intercept('GET', '/api/job-histories*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job-history');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('JobHistory').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details JobHistory page', () => {
    cy.intercept('GET', '/api/job-histories*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job-history');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('jobHistory');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create JobHistory page', () => {
    cy.intercept('GET', '/api/job-histories*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job-history');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('JobHistory');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit JobHistory page', () => {
    cy.intercept('GET', '/api/job-histories*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job-history');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('JobHistory');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of JobHistory', () => {
    cy.intercept('GET', '/api/job-histories*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job-history');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('JobHistory');

    cy.get(`[data-cy="startDate"]`).type('2024-04-11T09:35').invoke('val').should('equal', '2024-04-11T09:35');

    cy.get(`[data-cy="endDate"]`).type('2024-04-10T23:09').invoke('val').should('equal', '2024-04-10T23:09');

    cy.get(`[data-cy="language"]`).select('ENGLISH');

    cy.setFieldSelectToLastOfEntity('job');

    cy.setFieldSelectToLastOfEntity('department');

    cy.setFieldSelectToLastOfEntity('employee');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/job-histories*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job-history');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of JobHistory', () => {
    cy.intercept('GET', '/api/job-histories*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/job-histories/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job-history');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('jobHistory').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/job-histories*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('job-history');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
