"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

//Write a function in nav.js that is called when users click that navbar link. 

function navSubmitClick(evt) {
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $submitForm.show();
}

$navSubmit.on("click", navSubmitClick);

/* Display user's favorite upon clicking "favorits" */
function navClickFavorites(evt) {
  console.debug("navClickFavorites", evt);
  hidePageComponents();
  putUserFavoritesListOnPage();
  
}

$body.on("click", "#nav-favorites", navClickFavorites);

/*Display user's stories upon clicking "my stories" */

function navClickMyStories(evt) {
  console.debug("navClickMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navClickMyStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/* Hide everything other than the ability to click on "profile" */
function navClickProfile(evt) {
  console.debug("navClickProfile", evt);
  hidePageComponents();
  $userProfile.show();
}
$navUserProfile.on("click", navClickProfile);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}
