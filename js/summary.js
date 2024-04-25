/**
 * This function includes render functions for summary.html 
 * 
 */
function renderSummary() {
    getUserNameForGreet();
}

/**
 * This function checks whether username exists in localStorage or sessionStorage for a greet
 * 
 */
function getUserNameForGreet() {
    let userNameDiv = document.getElementById('userNameDiv');
    if (loggedAsGuest = true) {
        userNameDiv.innerHTML = 'Guest';
    } else {
        userNameDiv.innerHTML = users[currentUser]['name'];
    } 
}