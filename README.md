# hack-or-snooze
News Aggregator site based on HackerNews 

Hack or Snooze is a news aggregator site based off of Hacker News that allows users to create accounts, log in, create articles, mark articles as favorites, and more! It includes data models for stories and users, handles user authentication, and allows users to perform actions like adding/removing stories and favoriting/unfavoriting stories. The code utilizes Axios for making API requests and jQuery for DOM manipulation.

The purpose of this project was to demonstrate technical skills, and came with a pre-made CSS stylesheet.

Code logic:

The code is structured based on Separation of Concerns and Organization. We’ve divided the code up into those different parts for readability and maintenance. It’s often useful to think about the data and the UI separately, (a separation of concerns).
We used the backend server API to add features to the front-end Javascript.
Our front-end app consists of two parts: Classes and methods for the big data ideas: a Story class for each story, a StoryList class for the list of stories, and a User class for the logged-in user (if any). These methods also handle interacting with the API. Functions for the UI, handling things like reading form values from forms and manipulating the DOM.

There’s one JS file for the “data” layer of the app: js/models.js contains classes to manage the data of the app and the connection to the API. The name models.js to describe a file containing these kinds of classes that focus on the data and logic about the data. UI stuff shouldn’t go here.

For the UI layer, we’ve broken this into several files by topic:

- js/main.js contains code for starting the UI of the application, and other miscellaneous things.

- js/user.js contains code for UI about logging in/signing up/logging out, as well as code about remembering a user when they refresh the page and logging them in automatically. 

- js/stories.js contains code for UI about listing stories.

- js/nav.js contains code to show/hide things in the navigation bar, and well as code for when a user clicks in that bar.

For a visual map on the code logic, see http://curric.rithmschool.com/springboard/exercises/hack-or-snooze-ajax-api/_images/design.svg

To visit the app, go to https://shangitapaul.github.io/hack-or-snooze/
