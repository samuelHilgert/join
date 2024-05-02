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

async function updateUpcomingDate() {
  let allTaskTimeStamps = [];
  let allTimeStampsDifferences = [];
  let upcomingDate;
  let currentDate = new Date();
  let formattedDate = formatDateCorrect(currentDate);
  let datum = new Date(formattedDate);  // Erstelle ein Date-Objekt mit dem gewünschten Datum
  let timeStampCurrentDate = datum.getTime(); // Hole den Zeitstempel in Millisekunden
  await getTasksTimeStamps(allTaskTimeStamps, timeStampCurrentDate, allTimeStampsDifferences);
  let smallestDifference = Math.min(...allTimeStampsDifferences);   // Finde die kleinste Zahl im Array
  let indexOfDifference = allTimeStampsDifferences.indexOf(smallestDifference);
  upcomingDate = allTaskTimeStamps[indexOfDifference];
  let formattedUpcomingDate = formatUpcomingDate(upcomingDate);
  renderUpcomingDueDate(formattedUpcomingDate);
}

async function getTasksTimeStamps(allTaskTimeStamps, timeStampCurrentDate, allTimeStampsDifferences) {
  tasks.forEach(function (task) {
    if (task['dueDate']) {
      const parts = task['dueDate'].split("/");
      const datum = new Date(parts[2], parts[1] - 1, parts[0]);
      let timeStampTaskDueDate = datum.getTime(); // Hole den Zeitstempel in Millisekunden
      let dueDateDifference = calculateDifferencesOftimeStamps(timeStampCurrentDate, timeStampTaskDueDate);
      allTimeStampsDifferences.push(dueDateDifference);
      allTaskTimeStamps.push(datum);
    }
  });
}

function calculateDifferencesOftimeStamps(reference, dueDate) {
  return Math.abs(reference - dueDate);
}

function formatUpcomingDate(upcomingDate) {
  let monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  let formattedUpcomingDate = monthNames[upcomingDate.getMonth()] + " " + upcomingDate.getDate() + ", " + upcomingDate.getFullYear();
  return formattedUpcomingDate;
}

function renderUpcomingDueDate(formattedUpcomingDate) {
  let upcomingDueDate = document.getElementById("upcomingDueDate");
  upcomingDueDate.innerHTML = `${formattedUpcomingDate}`;
}

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
  allUrgentNumber.innerHTML = `<h3>${allUrgents}</h3><p>Urgent</p>`;
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

function forwardingBoard() {
  window.location.href = `./board.html`;
}

function changeImage(element, src) {
  element.querySelector(".summary-icon").src = src;
}

function restoreImage(element, defaultSrc) {
  element.querySelector(".summary-icon").src = defaultSrc;
}
