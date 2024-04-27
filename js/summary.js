/**
 * This function includes render functions for summary.html 
 * 
 */
function renderSummary() {
    getUserNameForGreet();
    displayGreeting();
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


function displayGreeting() {
    let greeting = getGreeting();
    document.getElementById('greeting').innerHTML = greeting;
}


function getGreeting() {
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let greeting;

    if (hours < 12) {
        greeting = 'Good morning,';
    } else if(hours < 18) {
        greeting = 'Good afternoon,';
    } else {
        greeting = 'Good evening,';
    }
    return greeting;
}

