Feature: REST API Object management

  Scenario: Add a new object
    Given I am using "RandomObjectsApi"
    When I send a request to "/objects"
    Then the response status should be 200
    And the response should contain "id"
    And the response should contain "name"

  Scenario: Add a new object with body
    Given I am using "RandomObjectsApi"
    When I send a POST request to "/objects" with body
      | name | Apple MacBook Pro 16                                                              |
      | data | {"year":2019,"price":1849.99,"CPU model":"Intel Core i9","Hard disk size":"1 TB"} |
    Then the response status should be 200
    And the response should contain "id"
    And the response should contain "name"
