let allTodos;
let allDones;
let allUrgents;
let formattedDeadline;
let allInProgress;
let allAwaitFeedback;
let allTasks;


/**
 * This function includes render functions for summary.html
 *
 */
async function renderSummary() {
  getUserNameForGreet();
  displayGreeting();
  getValuesForSummary();
  renderSummaryValues();
  await updateUpcomingDate();
}


/**
 * Retrieves values for summary statistics by filtering tasks into different categories
 * and calculates the number of tasks for each status. 
 * Updates global variables for the count of tasks in different status categories.
 */
function getValuesForSummary() {
  const allTasksByBacklog = tasks.filter((t) => t["category"] == "backlog");
  const allTasksByInProgress = tasks.filter((t) => t["category"] == "inProgress");
  const allTasksByDone = tasks.filter((t) => t["category"] == "done");
  const allTasksByUrgent = tasks.filter((t) => t["priority"] == "Urgent");
  const allAwaitFeedbackNumber = tasks.filter((t) => t["category"] == "awaitFeedback");
  allTodos = allTasksByBacklog.length;
  allDones = allTasksByDone.length;
  allUrgents = allTasksByUrgent.length;
  allInProgress = allTasksByInProgress.length;
  allAwaitFeedback = allAwaitFeedbackNumber.length;
  allTasks = tasks.length;
}


/**
 * Updates the upcoming due date asynchronously by finding the task with the nearest due date.
 * Retrieves current date and formats it. Calculates the time differences between current date
 * and task due dates, then finds the task with the smallest difference. Finally, renders the upcoming
 * due date on the page.
 * 
 * @returns {Promise<void>} A Promise that resolves once the upcoming due date is rendered.
 */
async function updateUpcomingDate() {
  let allTaskTimeStamps = [];
  let allTimeStampsDifferences = [];
  let upcomingDate;
  let datum = new Date();
  let timeStampCurrentDate = datum.getTime();
  await getTasksTimeStamps(allTaskTimeStamps, timeStampCurrentDate, allTimeStampsDifferences);
  let smallestDifference = Math.min(...allTimeStampsDifferences);
  let indexOfDifference = allTimeStampsDifferences.indexOf(smallestDifference);
  upcomingDate = allTaskTimeStamps[indexOfDifference];
  let formattedUpcomingDate = formatUpcomingDate(upcomingDate);
  renderUpcomingDueDate(formattedUpcomingDate);
}


/**
 * Retrieves the timestamps of all tasks asynchronously and calculates the differences 
 * between current date and task due dates. Pushes the differences and timestamps into 
 * arrays for further processing.
 * 
 * @param {Date[]} allTaskTimeStamps - An array to store the due date timestamps of all tasks.
 * @param {number} timeStampCurrentDate - The timestamp of the current date.
 * @param {number[]} allTimeStampsDifferences - An array to store the differences between current date
 *                                              and task due dates.
 * @returns {Promise<void>} A Promise that resolves once all task timestamps are retrieved and differences are calculated.
 */
async function getTasksTimeStamps(allTaskTimeStamps, timeStampCurrentDate, allTimeStampsDifferences) {
  tasks.forEach(function (task) {
    if (task['dueDate']) {
      const parts = task['dueDate'].split("/");
      const datum = new Date(parts[2], parts[1] - 1, parts[0]);
      let timeStampTaskDueDate = datum.getTime();
      let dueDateDifference = calculateDifferencesOftimeStamps(timeStampCurrentDate, timeStampTaskDueDate);
      allTimeStampsDifferences.push(dueDateDifference);
      allTaskTimeStamps.push(datum);
    }
  });
}


/**
 * This function calculates the absolute time difference between both timestamps
 * 
 * @param {number} reference - the reference timestamp
 * @param {number} dueDate - this timestamp is the dueDates
 * @returns {number} - the number of the absolute time difference
 */
function calculateDifferencesOftimeStamps(reference, dueDate) {
  return Math.abs(reference - dueDate);
}


/**
 * This function formagetes the upcoming date
 * 
 * @param {Date} upcomingDate - the date which should be formatted
 * @returns {string} the formatted upcoming date
 */
function formatUpcomingDate(upcomingDate) {
  let monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  let formattedUpcomingDate = monthNames[upcomingDate.getMonth()] + " " + upcomingDate.getDate() + ", " + upcomingDate.getFullYear();
  return formattedUpcomingDate;
}


/**
 * This function renders the formatted upcomming date in summary.html
 * 
 * @param {string} formattedUpcomingDate - the formatted upcoming date
 */
function renderUpcomingDueDate(formattedUpcomingDate) {
  let upcomingDueDate = document.getElementById("upcomingDueDate");
  upcomingDueDate.innerHTML = `${formattedUpcomingDate}`;
}


/**
 * This function sets the divs for rendering the values in the summary
 * 
 */
function renderSummaryValues() {
  let allTodosDiv = document.getElementById("allTodosNumber");
  let allDoneDiv = document.getElementById("allDoneNumber");
  let allUrgentDiv = document.getElementById("allUrgentNumber");
  let allTasksDiv = document.getElementById("allTasksNumber");
  let allInProgressDiv = document.getElementById("allInProgressNumber");
  let allAwaitFeedbackDiv = document.getElementById("allAwaitFeedbackNumber");
  renderValuesInSummary(allTodosDiv, allDoneDiv, allUrgentDiv, allTasksDiv, allInProgressDiv, allAwaitFeedbackDiv);
}


/**
 * This function renders the values in the summary
 * 
 * @param {string} allTodosDiv - element-div for amount of all "open" todos
 * @param {string} allDoneDiv - element-div for amount of all "done" todos
 * @param {string} allUrgentDiv - element-div for amount of all "urgent" todos
 * @param {string} allTasksDiv - element-div for amount of the rentire amount of todos
 * @param {string} allInProgressDiv - element-div for amount of all "in progress" todos
 * @param {string} allAwaitFeedbackDiv - element-div for amount of all "await feedback" todos
 */
function renderValuesInSummary(allTodosDiv, allDoneDiv, allUrgentDiv, allTasksDiv, allInProgressDiv, allAwaitFeedbackDiv) {
  allTodosDiv.innerHTML = `<h3>${allTodos}</h3>`;
  allDoneDiv.innerHTML = `<h3>${allDones}</h3>`;
  allUrgentDiv.innerHTML = `<h3>${allUrgents}</h3><p class="mobile-summary-category-text">Urgent</p>`;
  allTasksDiv.innerHTML = `<h3>${allTasks}</h3>`;
  allInProgressDiv.innerHTML = `<h3>${allInProgress}</h3>`;
  allAwaitFeedbackDiv.innerHTML = `<h3>${allAwaitFeedback}</h3>`;
}


/**
 * This function checks whether username exists in localStorage or sessionStorage for a greet
 *
 */
function getUserNameForGreet() {
  let userNameDiv = document.getElementById("userNameDiv");
  if ((authorized === 'guest')) {
    userNameDiv.innerHTML = "Guest";
    let div = document.getElementById("guestMessagePopupSummary");
    let messageText = document.getElementById("guestMessageSummary");
    showGuestPopupMessage(div, messageText);
  } else {
    userNameDiv.innerHTML = users[currentUser]["name"];
  }
}


/**
 * This function displays the greeting text
 */
function displayGreeting() {
  let greeting = getGreeting();
  document.getElementById("greeting").innerHTML = greeting;
}


/**
 * This function generates a greeting text based on the current time of day
 * 
 * @returns {string} - the generated greetings text
 */
function getGreeting() {
  let currentTime = new Date();
  let hours = currentTime.getHours();
  let greeting;

  if (hours < 12) {
    greeting = "Good morning,";
  } else if (hours < 18) {
    greeting = "Good afternoon,";
  } else {
    greeting = "Good evening,";
  }
  return greeting;
}


/**
 * This function forwards the user to board.html
 * 
 */
function forwardingBoard() {
  window.location.href = `./board.html`;
}


/**
 * This function changes the source of the images
 * 
 * @param {HTMLElement} element - the element-div of the image
 * @param {string} src - the new source for changing the image
 */
function changeImage(element, src) {
  element.querySelector(".summary-icon").src = src;
}


/**
 * This function resets the source to the default source of the image
 * 
 * @param {HTMLElement} element - the element-div of the image
 * @param {string} defaultSrc - the default source of the start image
 */
function restoreImage(element, defaultSrc) {
  element.querySelector(".summary-icon").src = defaultSrc;
}
