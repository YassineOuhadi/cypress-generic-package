Feature: SOAP API example

  Scenario: Get capital city
    Given I am using SOAP API "CountryInfoApi"
    When I call SOAP operation "CapitalCity"
    Then the SOAP response should contain "Washington"

  Scenario: Get capital city of US by passing args
    Given I am using SOAP API "CountryInfoApi"
    When I call SOAP operation "CapitalCity" with args
      | sCountryISOCode | US |
    Then the SOAP response should contain "Washington"
