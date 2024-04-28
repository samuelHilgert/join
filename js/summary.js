let tasksSummary = [];
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
function renderSummary() {
    getUserNameForGreet();
    displayGreeting();
    renderSummaryValues();
}

async function updateTasksForSummary() {
    if (loggedAsGuest === true) {
        await loadTasksForGuest();
        getValuesForSummary();
    } else {
        await loadTasksRemote();
        getValuesForSummaryJsonArray();
    }
}

function getValuesForSummaryJsonArray() {

    for (let index = 0; index < tasksSummary.length; index++) {
        const element = tasksSummary[index];
        const allTasksByBacklog = element.filter(t => t['category'] === 'backlog');
        const allTasksByInProgress = element.filter(t => t['category'] == 'inProgress');
        const allAwaitFeedbackNumber = element.filter(t => t['category'] == 'awaitFeedback');
        const allTasksByDone = element.filter(t => t['category'] === 'done');
        const allTasksByUrgent = element.filter(t => t['priority'] === 'Urgent');
        const upcomingDueDateTasks = element.filter(t => t['dueDate']);
        calculateUpcomingDate(upcomingDueDateTasks);
        allTodos = allTasksByBacklog.length;
        allInProgress = allTasksByInProgress.length;
        allDones = allTasksByDone.length;
        allUrgents = allTasksByUrgent.length;
        allAwaitFeedback = allAwaitFeedbackNumber.length;
        allTasks = tasksSummary[0].length;
    }
}


function calculateUpcomingDate(upcomingDueDateTasks) {
    let currentDate = new Date();
    // Deutsches Datumsformat verwenden
    let germanDateFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    let currentDateGermanFormat = currentDate.toLocaleDateString('de-DE', germanDateFormatOptions);
    let closestDueDateElement = null;
    let closestDueDateDifference = Infinity;

    upcomingDueDateTasks.forEach(task => {
        // Parse das deutsche Datum und vergleiche es mit dem aktuellen Datum
        const dueDateParts = task['dueDate'].split('.');
        const dueDate = new Date(dueDateParts[2], dueDateParts[1] - 1, dueDateParts[0]); // Jahr, Monat (0-based), Tag
        // Vergleiche das Fälligkeitsdatum mit dem aktuellen Datum
        if (dueDate >= currentDate) {
            const difference = Math.abs(dueDate - currentDate); // Betrachte die absolute Differenz
            if (difference < closestDueDateDifference) {
                closestDueDateElement = task;
                closestDueDateDifference = difference;
            }
        }
    });

    let upcomingDeadline = closestDueDateElement.dueDate;
    formattedDeadline = formatDate(upcomingDeadline);
}

function formatDate(dateString) {
    const months = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
    ];
    const dateParts = dateString.split('.');
    const day = parseInt(dateParts[0]);
    const monthIndex = parseInt(dateParts[1]) - 1;
    const year = parseInt(dateParts[2]);

    // Erstelle ein JavaScript-Datum-Objekt
    const date = new Date(year, monthIndex, day);

    // Formatieren des Datums
    const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    return formattedDate;
}

function getValuesForSummary() {
    const allTasksByBacklog = tasksSummary.filter(t => t['category'] == 'backlog');
    const allTasksByInProgress = tasksSummary.filter(t => t['category'] == 'inProgress');
    const allTasksByDone = tasksSummary.filter(t => t['category'] == 'done');
    const allTasksByUrgent = tasksSummary.filter(t => t['priority'] == 'Urgent');
    const allAwaitFeedbackNumber = tasksSummary.filter(t => t['category'] == 'awaitFeedback');
    const upcomingDueDateTasks = tasksSummary.filter(t => t['dueDate']);
    calculateUpcomingDate(upcomingDueDateTasks);
    allTodos = allTasksByBacklog.length;
    allDones = allTasksByDone.length;
    allUrgents = allTasksByUrgent.length;
    allInProgress = allTasksByInProgress.length;
    allAwaitFeedback = allAwaitFeedbackNumber.length;
    allTasks = tasksSummary.length;
}

async function loadTasksRemote() {
    tasksSummary.push(users[currentUser].tasks);
}


async function loadTasksForGuest() {
    let resp = await fetch('./JSON/tasks.json');
    tasksSummary = await resp.json();
}

function renderSummaryValues() {
    let allTodosNumber = document.getElementById('allTodosNumber');
    let allDoneNumber = document.getElementById('allDoneNumber');
    let allUrgentNumber = document.getElementById('allUrgentNumber');
    let allTasksNumber = document.getElementById('allTasksNumber');
    let allInProgressNumber = document.getElementById('allInProgressNumber');
    let allAwaitFeedbackNumber = document.getElementById('allAwaitFeedbackNumber');
    let upcomingDueDate = document.getElementById('upcomingDueDate');
    allTodosNumber.innerHTML = `<h3>${allTodos}</h3>`;
    allDoneNumber.innerHTML = `<h3>${allDones}</h3>`;
    allUrgentNumber.innerHTML = `<h3>${allUrgents}</h3><p>Urgent</p>`;
    allTasksNumber.innerHTML = `<h3>${allTasks}</h3>`;
    allInProgressNumber.innerHTML = `<h3>${allInProgress}</h3>`;
    allAwaitFeedbackNumber.innerHTML = `<h3>${allAwaitFeedback}</h3>`;
    upcomingDueDate.innerHTML = `${formattedDeadline}`;
}

/**
 * This function checks whether username exists in localStorage or sessionStorage for a greet
 * 
 */
function getUserNameForGreet() {
    let userNameDiv = document.getElementById('userNameDiv');
    if (loggedAsGuest === true) {
        userNameDiv.innerHTML = 'Guest';
        let div = document.getElementById('guestMessagePopupSummary');
        let messageText = document.getElementById('guestMessageSummary');
        showGuestPopupMessage(div, messageText);
    } else {
        userNameDiv.innerHTML = users[currentUser]['name'];
    }
}

/**
 * This function displays the greeting text
 */
function displayGreeting() {
    let greeting = getGreeting();
    document.getElementById('greeting').innerHTML = greeting;
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
        greeting = 'Good morning,';
    } else if (hours < 18) {
        greeting = 'Good afternoon,';
    } else {
        greeting = 'Good evening,';
    }
    return greeting;
}

function forwardingBoard() {
    window.location.href = `./board.html`;
}