Feature: GraphQL API example

  Scenario: Fetch all countries
    Given I am using GraphQL API "CountriesApi"
    When I send GraphQL query "AllCountries"
    Then the GraphQL response should contain "US"
    
  Scenario: Custom query
    Given I am using GraphQL API "CountriesApi"
    When I send GraphQL query
      """
      {
        countries {
          code
          name
        }
      }
      """
    Then the GraphQL response should contain "US"

