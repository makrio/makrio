@javascript
Feature: editing your profile
  Scenario: editing profile fields
    Given I am signed in
    And I go to the edit profile page
    When I fill in "profile_first_name" with "Boba Fett"
    When I fill in "profile_location" with "the suburbs"
    And I press "Update Profile"
    Then I should be on my edit profile page
    And I should see "Profile updated"
    And the "profile_first_name" field should contain "Boba Fett"
    When I go to my new profile page
    Then I should see "Boba Fett"
    And I should see "the suburbs"
