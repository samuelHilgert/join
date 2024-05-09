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
  const allTasksByInProgress = tasks.filter(
    (t) => t["category"] == "inProgress"
  );
  const allTasksByDone = tasks.filter((t) => t["category"] == "done");
  const allTasksByUrgent = tasks.filter((t) => t["priority"] == "Urgent");
  const allAwaitFeedbackNumber = tasks.filter(
    (t) => t["category"] == "awaitFeedback"
  );
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
 * Berechnet den absoluten Zeitunterschied zwischen zwei Zeitstempeln.
 * @param {number} reference - Der Referenzzeitstempel.
 * @param {number} dueDate - Der Zeitstempel des Fälligkeitsdatums.
 * @returns {number} Der absolute Zeitunterschied zwischen den beiden Zeitstempeln.
 */
function calculateDifferencesOftimeStamps(reference, dueDate) {
  return Math.abs(reference - dueDate);
}

/**
 * Formatiert ein Datum für die bevorstehende Anzeige.
 * @param {Date} upcomingDate - Das bevorstehende Datum, das formatiert werden soll.
 * @returns {string} Das formatierte Datum im Format "Monat Tag, Jahr".
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
 * Rendert das bevorstehende Fälligkeitsdatum auf der Seite.
 * @param {string} formattedUpcomingDate - Das formatierte bevorstehende Datum.
 */
function renderUpcomingDueDate(formattedUpcomingDate) {
  let upcomingDueDate = document.getElementById("upcomingDueDate");
  upcomingDueDate.innerHTML = `${formattedUpcomingDate}`;
}

/**
 * Rendert die Werte der Zusammenfassung auf der Seite.
 */
function renderSummaryValues() {
  let allTodosNumber = document.getElementById("allTodosNumber");
  let allDoneNumber = document.getElementById("allDoneNumber");
  let allUrgentNumber = document.getElementById("allUrgentNumber");
  let allTasksNumber = document.getElementById("allTasksNumber");
  let allInProgressNumber = document.getElementById("allInProgressNumber");
  let allAwaitFeedbackNumber = document.getElementById(
    "allAwaitFeedbackNumber"
  );
  allTodosNumber.innerHTML = `<h3>${allTodos}</h3>`;
  allDoneNumber.innerHTML = `<h3>${allDones}</h3>`;
  allUrgentNumber.innerHTML = `<h3>${allUrgents}</h3><p class="mobile-summary-category-text">Urgent</p>`;
  allTasksNumber.innerHTML = `<h3>${allTasks}</h3>`;
  allInProgressNumber.innerHTML = `<h3>${allInProgress}</h3>`;
  allAwaitFeedbackNumber.innerHTML = `<h3>${allAwaitFeedback}</h3>`;
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
 * Leitet den Benutzer zur Board-Seite weiter.
 */
function forwardingBoard() {
  window.location.href = `./board.html`;
}

/**
 * Ändert die Quelle des Bildes eines Elements.
 * @param {HTMLElement} element - Das HTML-Element, dessen Bildquelle geändert werden soll.
 * @param {string} src - Die neue Bildquelle.
 */
function changeImage(element, src) {
  element.querySelector(".summary-icon").src = src;
}

/**
 * Stellt die ursprüngliche Bildquelle eines Elements wieder her.
 * @param {HTMLElement} element - Das HTML-Element, dessen Bildquelle wiederhergestellt werden soll.
 * @param {string} defaultSrc - Die ursprüngliche Bildquelle.
 */
function restoreImage(element, defaultSrc) {
  element.querySelector(".summary-icon").src = defaultSrc;
}
