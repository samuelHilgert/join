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
    const savedDataSesssionStorage = sessionStorage.getItem('user');
    const savedDataLocalStorage = localStorage.getItem('user');
    if (savedDataSesssionStorage) {
        loadSessionStorage(userNameDiv, savedDataSesssionStorage);
    } else {
        if (savedDataLocalStorage) {
            loadLocalStorage(userNameDiv, savedDataLocalStorage);
        }
    }
}

/**
 * This function loads user data from session storage
 * 
 */
function loadSessionStorage(userNameDiv, savedDataSesssionStorage) {
    let parsedUserData = JSON.parse(savedDataSesssionStorage);
    let parsedUserName = parsedUserData['name'];
    userNameDiv.innerHTML = parsedUserName;
}

/**
 * This function loads user data from local storage
 * 
 */
function loadLocalStorage(userNameDiv, savedDataLocalStorage) {
    let parsedUserData = JSON.parse(savedDataLocalStorage);
    let parsedUserName = parsedUserData['name'];
    userNameDiv.innerHTML = parsedUserName;
}

