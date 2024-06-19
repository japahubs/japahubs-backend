Feature: Create Post
         As an authenticated user,
         I want to make a post in the community,
         So that I can start discussions and learn from others

         Scenario: Submitting a post
                   Given I am an authenticated user
                   When I submit a post with valid post details
                   Then I should be able to interact with the post

         Scenario: Invalid or missing post details
                   Given I am an authenticated user
                   When I submit a post with invalid or missing post details
                   Then I should be informed of which details are invalid or missing

         Scenario: User doesn't exist
                   Given I am an authenticated user
                   When I submit a post with a user that doesn't exist
                   Then I should be informed that the user doesn't exist

                   