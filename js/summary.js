let tasksSummary = [];
let allTodos;
let allDones;
let allUrgents;

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
        const allTasksByBacklog = element.filter(t => t['category'] == 'backlog');
        const allTasksByDone = element.filter(t => t['category'] == 'done');
        const allTasksByUrgent = element.filter(t => t['priority'] == 'Urgent');
        allTodos = allTasksByBacklog.length;
        allDones = allTasksByDone.length;
        allUrgents = allTasksByUrgent.length;
    }
}

function getValuesForSummary() {
    const allTasksByBacklog = tasksSummary.filter(t => t['category'] == 'backlog');
    const allTasksByDone = tasksSummary.filter(t => t['category'] == 'done');
    const allTasksByUrgent = element.filter(t => t['priority'] == 'Urgent');
    allTodos = allTasksByBacklog.length;
    allDones = allTasksByDone.length;
    allUrgents = allTasksByUrgent.length;
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
    allTodosNumber.innerHTML = `<h3>${allTodos}</h3>`;
    allDoneNumber.innerHTML = `<h3>${allDones}</h3>`;
    allUrgentNumber.innerHTML = `<h3>${allUrgents}</h3><p>Urgent</p>`;
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

