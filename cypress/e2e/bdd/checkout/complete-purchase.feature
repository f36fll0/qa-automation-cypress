
Feature: Complete Purchase on OpenCart

  As a registered customer
  I want to purchase a product
  So that I can complete an order successfully

  Scenario: Complete a purchase and verify the order
    Given the customer is logged in to OpenCart
    When the customer adds a product to the shopping cart
    And verifies the product, quantity, and price
    And completes the shipping and payment details
    And confirms the order
    Then the order confirmation should be displayed
    And the order should appear in the order history
