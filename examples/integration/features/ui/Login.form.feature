@project=examples
Feature: Login form testing example

  Background:
    Given I visit HomePage
    And I click on Form Authentication item from MainMenu 

  Scenario Outline: Successful login with valid credentials
    Given I am on LoginPage
    When I fill the form with data:
      | username   | password |
      | <username> | <password> |
    When I submit the LoginForm
    Then I should be on SecurePage
    Then I should see "You logged into a secure area!"

    Examples:
      | username  | password              |
      | tomsmith  | SuperSecretPassword!  |