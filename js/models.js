"use strict";

const BASE_URL = "https://hack-or-snooze-v3.herokuapp.com";

/******************************************************************************
 * Story: a single story in the system
 */

class Story {

  /** Make instance of Story from data object about story:
   *   - {title, author, url, username, storyId, createdAt}
   */

  constructor({ storyId, title, author, url, username, createdAt }) {
    this.storyId = storyId;
    this.title = title;
    this.author = author;
    this.url = url;
    this.username = username;
    this.createdAt = createdAt;
  }

  /** Parses hostname out of URL and returns it. */

  getHostName() {
    const url = new URL(this.url);
    return url.hostname;
  }
}


/******************************************************************************
 * List of Story instances: used by UI to show story lists in DOM.
 */

class StoryList {
  constructor(stories) {
    this.stories = stories;
  }

  /** Generate a new StoryList. It:
   *
   *  - calls the API
   *  - builds an array of Story instances
   *  - makes a single StoryList instance out of that
   *  - returns the StoryList instance.
   */

  static async getStories() {
    // Note presence of `static` keyword: this indicates that getStories is
    //  **not** an instance method. Rather, it is a method that is called on the
    //  class directly. Why doesn't it make sense for getStories to be an
    //  instance method?
    //ANSWER: getStories is responsible for getting all the stories from the server and creating a new instance of StoryList based on the data. It is not specific to any instance of StoryList, thus, it should be a static method and not instance method. 

    // query the /stories endpoint (no auth required)
    const response = await axios({
      url: `${BASE_URL}/stories`,
      method: "GET",
    });

    // turn plain old story objects from API into instances of Story class
    const stories = response.data.stories.map(story => new Story(story));

    // build an instance of our own class using the new array of stories
    return new StoryList(stories);
  }
  //Subpart 2A: Sending Story Data to the Backend API
  
  /** Adds story data to API, makes a Story instance, adds it to story list.
   * - user - the current instance of User who will post the story
   * - obj of {title, author, url}
   *
   * Returns the new Story instance
   */

  

  async addStory(user, {title, author, url}) {
    //extracts loginToken from user object 
    const token = user.loginToken;
    //makes a POST request to the API to create and add a new story to the server using axios library
    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/stories`,
      data: { token, story: {title, author, url} }
    });

    const story = new Story(response.data.story);
    //creates a new story object from the response data and adds it to the beginning of the stories array
    this.stories.unshift(story);
    //adds the new story to the beginning of the user's ownStories array in the user object
    user.ownStories.unshift(story);
    //returns the new story 
    return story;
  }

  /** Delete story from API and from story lists*/

  async removeStory(user, storyId) {
    //extracts loginToken from user object
    const token = user.loginToken;
    //sends a DELETE request to the API server to remove the story from the server
      //This deletes the story with specified id (storyId) using axios library and sends token in the request body to authenticate the request and waits for the response with await
      //the story is not stored and simply deleted from the server
    await axios({
      method: "DELETE",
      url: `${BASE_URL}/stories/${storyId}`,
      data: { token }
    });

    //filters out the story with the specified id from the stories array
    this.stories = this.stories.filter(story => story.storyId !== storyId);
    //Filters/updates ownStories array in the client side, but is filtering based on the storyId instead of the story object reference.
      //note: ownStories is an array containing sthe USER's storyId's and not the full story objects
    user.ownStories = user.ownStories.filter(s => s.storyId !== storyId);
    user.favorites = user.favorites.filter(s => s.storyId !== storyId);
  }


}


/******************************************************************************
 * User: a user in the system (only used to represent the current user)
 */

class User {
  /** Make user instance from obj of user data and a token:
   *   - {username, name, createdAt, favorites[], ownStories[]}
   *   - token
   */

  constructor({
                username,
                name,
                createdAt,
                favorites = [],
                ownStories = []
              },
              token) {
    this.username = username;
    this.name = name;
    this.createdAt = createdAt;

    // instantiate Story instances for the user's favorites and ownStories
    this.favorites = favorites.map(s => new Story(s));
    this.ownStories = ownStories.map(s => new Story(s));

    // store the login token on the user so it's easy to find for API calls.
    this.loginToken = token;
  }
  // addFavorite(story) {
  //   this.favorites.push(story);
  // }

  // removeFavorite(story) {
  //   this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
  // }
  // isFavorite(story) {
  //   return this.favorites.some(s => s.storyId === story.storyId);
  // }

  /** Register new user in API, make User instance & return it.
   *
   * - username: a new username
   * - password: a new password
   * - name: the user's full name
   */

  static async signup(username, password, name) {
    const response = await axios({
      url: `${BASE_URL}/signup`,
      method: "POST",
      data: { user: { username, password, name } },
    });

    let { user } = response.data

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** Login in user with API, make User instance & return it.

   * - username: an existing user's username
   * - password: an existing user's password
   */

  static async login(username, password) {
    const response = await axios({
      url: `${BASE_URL}/login`,
      method: "POST",
      data: { user: { username, password } },
    });

    let { user } = response.data;

    return new User(
      {
        username: user.username,
        name: user.name,
        createdAt: user.createdAt,
        favorites: user.favorites,
        ownStories: user.stories
      },
      response.data.token
    );
  }

  /** When we already have credentials (token & username) for a user,
   *   we can log them in automatically. This function does that.
   */

  static async loginViaStoredCredentials(token, username) {
    try {
      const response = await axios({
        url: `${BASE_URL}/users/${username}`,
        method: "GET",
        params: { token },
      });

      let { user } = response.data;

      return new User(
        {
          username: user.username,
          name: user.name,
          createdAt: user.createdAt,
          favorites: user.favorites,
          ownStories: user.stories
        },
        token
      );
    } catch (err) {
      console.error("loginViaStoredCredentials failed", err);
      return null;
    }
  }

/*Add favorite story to the user's favorites list and update the API server*/

async addFavoriteStories(story) {
  this.favorites.push(story);
  await this._addOrRemoveFavorite("add", story);
}

/*Remove favorite story from the user's favorites list and update the API server*/
async removeFavoriteStories(story) {
  this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
  await this._addOrRemoveFavorite("remove", story);
}

/*Update the API server with the user's favorites and non-favorits list*/
async _addOrRemoveFavorite(userAddOrRemove, story) {
  const method = userAddOrRemove === "add" ? "POST" : "DELETE";
  const token = this.loginToken;
  await axios({
    url: `${BASE_URL}/users/${this.username}/favorites/${story.storyId}`,
    method : method,
    data: { token }
  });
}

/*Return boolean true or false if the story is in the user's favorites list*/

isFavorite(story) {
  return this.favorites.some(s => s.storyId === story.storyId);
  }
}


