"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */


async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  //When the page loads, check if the current user has any favorited stories and mark them as favorites.
  // if (currentUser) {
  //   await currentUser.retrieveDetails();
  //   storyList.stories.forEach(story => {
  //     if (currentUser.isFavorite(story)) {
  //       story.isFavorite = true;
  //     }
  //   });
  // }

  putStoriesOnPage();
}

/* OR?
When the page loads, check if the current user has any favorited stories and mark them as favorites.

async function markFavoritesOnLoad() {
  if (currentUser) {
    await currentUser.retrieveDetails();
    const favorites = new Set(currentUser.favorites.map(story => story.storyId));
    for (let story of storyList.stories) {
      if (favorites.has(story.storyId)) {
        const $story = $allStoriesList.find(`#${story.storyId}`);
        const $icon = $story.find('i');
        $icon.removeClass('far').addClass('fas');
      }
    }
  }
}

// Call the function when the page loads
$(async function() {
  await getAndShowStoriesOnStart();
  await markFavoritesOnLoad();
});
*/

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

//creates deleteButton variable that is set to false by default to indicate that the delete button should not be shown when generating markup for a story;
  //by setting it to false, it alloows generateStoryMarkup to be called without passing in a second argument.
function generateStoryMarkup(story, deleteButton = false) {
  //console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  //Subpart 3A: Data/API Changes
    /*Allow logged in users to "favorite" and "unfavorite" stories using a /* `star` is a class that is
    being used to identify
    the favorite icon in the
    HTML markup for a story.
    It is being used as a
    selector in the event
    listener to listen for
    clicks on the favorite
    icon and toggle the
    favorite status of the
    story. */
    //choose star icon from the Font Awesome library.
    //stories should remain favorited when a user refreshes the page
  let faveStory = "";
  if (currentUser) {
    if (currentUser.isFavorite(story)) {
      faveStory = '<i class="fas fa-star"></i>';
    } else {
      faveStory = '<i class="far fa-star"></i>';
    }
  }

  //create new JQuery element with list elements for the given story, that has id attribute that matches storyId, and url href attribute that matches story.url.
  //story hostname is displayed in a small tag with class story-hostname, and story author is displayed in a small tag with class story-author, and story username is displayed in a small tag with class story-user.
 
  const $story = $(`
    <li id="${story.storyId}">
      ${deleteButton ? getDeleteButtonHtml() : ""}
      <a href="${story.url}" target="a_blank" class="story-link">
        ${story.title}
      </a>
      <small class="story-hostname">(${hostName})</small>
      <small class="story-author">by ${story.author}</small>
      <small class="story-user">posted by ${story.username}</small>
    
      ${faveStory} 
    </li>
  `);

  //if a current user is logged in, and the story is favorited by the user, the facorited icon from the font AWESOME library should be solid
    //When the icon element is clicked, the handler checks whether or not the i element has a class of FAR to indicate the story is not favorited by the user.
      // If the i element has a class of far, the handler calls the addFavorite method on the currentUser passing in the current story as an argument, and changes the i element's classes from far to FAS. 
      //If the i element does not have a class of far(favorited), the handler calls the removeFavorite method on the currentUser object, passing in the current story as an argument, and changes the i element's classes from fas to far.
  if (currentUser) {
    $story.on('click', 'i', function() {
      const $icon = $(this);
      if ($icon.hasClass('far')) {
        currentUser.addFavoriteStories(story);
        $icon.removeClass('far').addClass('fas');
        //otherwise, the icon should be empty.
      } else {
        currentUser.removeFavoriteStories(story);
        $icon.removeClass('fas').addClass('far');
      }
    });
  }
  //Returns $story object containing all HTML elements for the current story, as well as the favorite icon if the user is logged in.
  return $story;
}
        
/*
// In the User class

class User {
  // ...

  addFavorite(story) {
    this.favorites.push(story);
  }

  removeFavorite(story) {
    this.favorites = this.favorites.filter(s => s.storyId !== story.storyId);
  }

  isFavorite(story) {
    return this.favorites.some(s => s.storyId === story.storyId);
  }
}
*/

//create function that returns HTML for delete button for a story
function getDeleteButtonHtml() {
  return `<span class="trash-bin">
            <i class="fas fa-trash-alt"></i>
          </span>`;
}


//create function that returns HTML for favorited icon for a story
function getFavoriteHtml(story, user) {  
  if (user.isFavorite(story)) {
    return `<i class="fas fa-star"></i>`;
  } else {
    return `<i class="far fa-star"></i>`;
  }
}

//   return $(`
//       <li id="${story.storyId}">
//         <a href="${story.url}" target="a_blank" class="story-link">
//           ${story.title}
//         </a>
//         <small class="story-hostname">(${hostName})</small>
//         <small class="story-author">by ${story.author}</small>
//         <small class="story-user">posted by ${story.username}</small>
//       </li>
//     `);
// }

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    let $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");

  $ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }

  $ownStories.show();
}
// Handle deleting a story
async function deleteStory(evt) {
  //logs a debug message to the console to indicate that the deleteStory function has been called
  console.debug("deleteStory");

  // Get the ID of the story to be deleted
    //uses evt.target to get clocked element, then uses closest('li') to get the closest ancestor <li> element and retrieves its id attribute
  const storyId = $(evt.target).closest("li").attr("id");

  // Call the removeStory method on the storyList object to delete the story, then pass currentUser and storyId as arguments to the method. 
  // await indicates that the function will wait for the deletion operation to complete before proceeding.
  await storyList.removeStory(currentUser, storyId);

  // Remove the deleted story from the page using the closest method to get the closest ancestor <li> element and remove it from the DOM
  // $(evt.target).closest("li").remove();
  //regenerate story list; calls putStoriesOnPage function to upddate the displayed stories after deleting
  await putUserStoriesOnPage();
}


// Event listener implementation:
  //Use event delegation to listen for the delete button click event on the stories list.
  // Recall that ownStories is the <ul> element that contains the user's own stories.
$ownStories.on("click", ".trash-bin", deleteStory);
  

/** Subpart 2B: Building The UI for New Story Form/Add New Story
 * 
 * Submits new story to server, adds story to page, and resets form. */

async function submitStory(evt) {
  console.debug("submitStory");
  // prevent default form behavior; form is not submitted to server by default, and function handles submission
  evt.preventDefault();

  // get the data from the form using Jquery val method
  const title = $("#story-title").val();
  const author = $("#story-author").val();
  const url = $("#story-url").val();
  const username = currentUser.username;
  const storyData = {title, author, url, username};

  // call the .addStory method on storyList object and passes in current user and new Story object {title, author, url} to add the new story.
  const newStory = await storyList.addStory(currentUser, storyData);

  //After generating new story, the html markup is generated for the new story
  const $newStory = generateStoryMarkup(newStory);
  //and prepended to the list of stories on the page
  $allStoriesList.prepend($newStory);

  // reset the form to clear the input fields
  $("#submit-form").trigger("reset");
  // hide the form 
  //animates the form sliding up and out of view
  $("#submit-form").slideUp("slow");
}

// Event Handler:
  //Uses jquery ".on" method to listen for the form submit event and call the submitStory function to handle submission, as intended 
$("#submit-form").on("submit", submitStory);


/*User Stories list*/

function putUserFavoritesListOnPage() {
  console.debug("putUserFavoritesListOnPage");

  $favoritedStories.empty();
  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of user's favorites and generate HTML markup
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}




  
/* Handle favoriting and unfavoriting a story */
async function favoriteToggleSwitch(evt) {
  console.debug("favoriteToggleSwitch");
  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  //check if the story is already favorited
  if ($tgt.hasClass("fas")) {
    //if so, remove the favorite from the user's list
    await currentUser.removeFavorite(story);
    //and change the icon to an empty star
    $tgt.closest("i").toggleClass("fas far");
  } else {
    //if not, add the favorite to the user's list
    await currentUser.addFavorite(story);
    //and change the icon to a filled star
    $tgt.closest("i").toggleClass("fas far");
  }
}
$storiesLists.on("click", ".star", favoriteToggleSwitch);

