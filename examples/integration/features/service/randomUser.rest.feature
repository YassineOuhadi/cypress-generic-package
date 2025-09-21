Feature: Rest API testing example

  @project=examples
  Scenario: Validate GET /api returns random user
    Given I am using "RandomUserApi"
    When I send a GET request to "/api"
    Then the response status should be 200
    And the response should contain "results"