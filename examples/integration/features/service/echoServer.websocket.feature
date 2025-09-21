Feature: WebSocket API example

  Scenario: Send ping
    Given I am connected to WebSocket API "EchoServer"
    When I send WebSocket message
      | type | ping |
    Then the WebSocket response should contain "ping"
    And I close the WebSocket connection

  Scenario: Send custom message
    Given I am connected to WebSocket API "EchoServer"
    When I send WebSocket message
      | text | Hello, WebSocket Echo Server! |
    Then the WebSocket response should contain "Hello"
    And I close the WebSocket connection