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

describe('Job e2e test', () => {
  let startingEntitiesCount = 0;

  before(() => {
    cy.window().then(win => {
      win.sessionStorage.clear();
    });

    cy.clearCookies();
    cy.intercept('GET', '/api/jobs*').as('entitiesRequest');
    cy.visit('');
    cy.login('admin', 'admin');
    cy.clickOnEntityMenuItem('job');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.visit('/');
  });

  it('should load Jobs', () => {
    cy.intercept('GET', '/api/jobs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job');
    cy.wait('@entitiesRequest');
    cy.getEntityHeading('Job').should('exist');
    if (startingEntitiesCount === 0) {
      cy.get(entityTableSelector).should('not.exist');
    } else {
      cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
    }
    cy.visit('/');
  });

  it('should load details Job page', () => {
    cy.intercept('GET', '/api/jobs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityDetailsButtonSelector).first().click({ force: true });
      cy.getEntityDetailsHeading('job');
      cy.get(entityDetailsBackButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should load create Job page', () => {
    cy.intercept('GET', '/api/jobs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job');
    cy.wait('@entitiesRequest');
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Job');
    cy.get(entityCreateSaveButtonSelector).should('exist');
    cy.visit('/');
  });

  it('should load edit Job page', () => {
    cy.intercept('GET', '/api/jobs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job');
    cy.wait('@entitiesRequest');
    if (startingEntitiesCount > 0) {
      cy.get(entityEditButtonSelector).first().click({ force: true });
      cy.getEntityCreateUpdateHeading('Job');
      cy.get(entityCreateSaveButtonSelector).should('exist');
    }
    cy.visit('/');
  });

  it('should create an instance of Job', () => {
    cy.intercept('GET', '/api/jobs*').as('entitiesRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job');
    cy.wait('@entitiesRequest').then(({ request, response }) => (startingEntitiesCount = response.body.length));
    cy.get(entityCreateButtonSelector).click({ force: true });
    cy.getEntityCreateUpdateHeading('Job');

    cy.get(`[data-cy="jobTitle"]`)
      .type('District Communications Developer', { force: true })
      .invoke('val')
      .should('match', new RegExp('District Communications Developer'));

    cy.get(`[data-cy="minSalary"]`).type('75369').should('have.value', '75369');

    cy.get(`[data-cy="maxSalary"]`).type('12065').should('have.value', '12065');

    cy.setFieldSelectToLastOfEntity('task');

    cy.setFieldSelectToLastOfEntity('employee');

    cy.get(entityCreateSaveButtonSelector).click({ force: true });
    cy.scrollTo('top', { ensureScrollable: false });
    cy.get(entityCreateSaveButtonSelector).should('not.exist');
    cy.intercept('GET', '/api/jobs*').as('entitiesRequestAfterCreate');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job');
    cy.wait('@entitiesRequestAfterCreate');
    cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount + 1);
    cy.visit('/');
  });

  it('should delete last instance of Job', () => {
    cy.intercept('GET', '/api/jobs*').as('entitiesRequest');
    cy.intercept('DELETE', '/api/jobs/*').as('deleteEntityRequest');
    cy.visit('/');
    cy.clickOnEntityMenuItem('job');
    cy.wait('@entitiesRequest').then(({ request, response }) => {
      startingEntitiesCount = response.body.length;
      if (startingEntitiesCount > 0) {
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount);
        cy.get(entityDeleteButtonSelector).last().click({ force: true });
        cy.getEntityDeleteDialogHeading('job').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click({ force: true });
        cy.wait('@deleteEntityRequest');
        cy.intercept('GET', '/api/jobs*').as('entitiesRequestAfterDelete');
        cy.visit('/');
        cy.clickOnEntityMenuItem('job');
        cy.wait('@entitiesRequestAfterDelete');
        cy.get(entityTableSelector).should('have.lengthOf', startingEntitiesCount - 1);
      }
      cy.visit('/');
    });
  });
});
