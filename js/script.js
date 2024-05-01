let users = [];
let contacts = [];
let tasks = [];
let rememberStatus = [];
let setResetExpiryTime = 2832323; // Set the logout time when the user has not used the reminder option
let popupCloseTime = 8000; // Set popup display time
let authorized = 'none';
let currentUser;

/**
 * This is a function to initialize render functions 
 * 
 */
async function init() {
    setAuthorizedStatus();
    if (authorized === 'none') {
        await unauthorizedFunctions();
    }
    else {
        if ((authorized === 'user')) {
            await loadUserData();
        }
        await updateOrLoadData();
        await loadLoggedTime();
        await includeHTML();
        getCurrentlySidebarLink(); // in sidebar.js
        renderHeader();
        startExpiryCheckInterval(rememberStatus); // check whether the current time is greater than or equal to the expiration date
        await initiateIndividualFunctions();
    }
}

/**
 * This functions includes all functions for unauthorized access
 * 
 */
async function unauthorizedFunctions() {
    checkFalseOpening();
    await includeHTML();
    getCurrentlySidebarLink();
}

/**
 * This function checks if the user used the login. If not the authorized status get the status 'none'. In this case user will not get an access.
 * If user used the login, the current user-array-position will load from the remote server otherwise authorized will get the status 'guest'
 * 
 */
function setAuthorizedStatus() {
    let loggedStatus = localStorage.getItem('logged');
    let userId = localStorage.getItem('user');
    if (loggedStatus === null && userId === null) {
        authorized = 'none';
    } else if (localStorage.getItem('logged')) {
        authorized = 'guest';
    } else if (localStorage.getItem('user')) {
        authorized = 'user';
        currentUser = userId;
    }
}

/**
 * This function secures unauthorized opening of pages via the URL by copying and pasting without logged in as user or guest
 * 
 */
function checkFalseOpening() {
    let currentUrl = window.location.href;
    if (currentUrl.indexOf('?external') !== -1) {
    } else {
        firstLogin();
    }
}

function firstLogin() {
    return window.location.href = `./login.html`;
}

/**
 * This is a function to include outsourced html elements
 * 
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[include-html]'); // Es wird nach Begriff gesucht 
    for (let i = 0; i < includeElements.length; i++) { // Es wird durchiteriert
        const element = includeElements[i]; // alle elemente sollen angesprochen werden 
        file = element.getAttribute("include-html"); // es wird der Wert des Begriffs gesucht, indem Fall der Pfad: "./header.html"
        let resp = await fetch(file); // Es besteht jetzt nur Zugang, noch nicht der Text. Ladevorgang wird als Variable deklariert, um weiter arbeiten zu können
        if (resp.ok) { // Abfrage, um auf Fehler zu prüfen
            element.innerHTML = await resp.text(); // wenn gefunden, Datei wird aufgerufen und Inhalt ausgegeben 
        } else {
            element.innerHTML = 'Page not found'; // wenn nicht gefunden, Ausgabe Fehlermeldung text
        }
    }
}

/**
 * This function loads the value, whether the user logged in with the remember option
 * The data is initiate in login.js
 * 
 */
async function loadLoggedTime() {
    try {
        rememberStatus = JSON.parse(await getItem('remember_status'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * This is a query which page is visited and launch functions
 * 
 */
async function initiateIndividualFunctions() {
    let pages = ['summary', 'add-task', 'board', 'contacts', 'privacy-policy', 'legal-notice', 'help'];
    for (let index = 0; index < pages.length; index++) {
        const currentPage = pages[index];
        if (document.location.pathname === `/${currentPage}.html`) {
            await resetExpiryTime();
            if (currentPage === 'summary') {
                renderSummary();
            } else if (currentPage === 'add-task') {
                await updateTaskContacts();
            } else if (currentPage === 'board') {
                await renderBoardTasks();
            } else if (currentPage === 'contacts') {
                await renderContacts();
            }
        }
    }
}

/**
 * This function resets the expiration time for the logout
 * 
 */
async function resetExpiryTime() {
    rememberStatus[0].expiryDate = new Date().getMinutes() + setResetExpiryTime; // global variable that can be changed
    await setItem('remember_status', JSON.stringify(rememberStatus));
}

/**
 * This function loads the user data from the remote server to the local array "users"
 * 
 */
async function loadUserData() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * This is a function that checks whether a guest or user has logged in
 * The data is only saved remotely if the user is logged in
 * In both cases sample contacts and tasks are also loaded
 * 
 */
async function updateOrLoadData() {
    if ((authorized === 'user')) {
        let userData = users[currentUser];
        if (userData.contacts.length === 0 || userData.tasks.length === 0) {
            await loadExamples();
        }
        else {
            contacts = users[currentUser].contacts;
            tasks = users[currentUser].tasks;
        }
        await saveNewUserDate();
    }
    await loadExamples();
}

/**
 * This is a function which includes the sample contacts from the contacts.json JSON-Document 
 * 
 */
async function loadExamples() {
    let respContacts = await fetch('./JSON/contacts.json');
    let respTasks = await fetch('./JSON/tasks.json');
    contacts = await respContacts.json();
    tasks = await respTasks.json();
}

/**
 * This function moves the data in local arrays and on the server
 * 
 */
async function saveNewUserDate() {
    users[currentUser].contacts = contacts;
    users[currentUser].tasks = tasks;
    await setItem('users', JSON.stringify(users));
}

/**
 * This function renders header elements
 * 
 */
function renderHeader() {
    let lettersDiv = document.getElementById('headerUserName');
    hideHelpIcon();
    renderLettersByName(lettersDiv);
}

/**
 * This function is included in setInterval in init()
 * It checks whether the time to log out has expired if the user did not use the reminder option.
 *
 */

function startExpiryCheckInterval(rememberStatus) {
    setInterval(function () {
        checkExpiryAndReset(rememberStatus);
    }, 30000); // repeat query every 30 seconds
}

/**
 * The logout time is reset every time the user clicks on an HTML document
 * 
 */
function checkExpiryAndReset(rememberStatus) {
    let expiryTime = rememberStatus[0].expiryDate;
    if (rememberStatus[0].remember_status === false) {
        let now = new Date().getMinutes();
        if (now >= expiryTime) { // time is over
            resetLoginValues();
            setTimeout(firstLogin, 1000);
        }
    }
}

/**
 * This function checks whether help.html is clicked. If this is the case, the help icon will be hidden
 * 
 */
function hideHelpIcon() {
    let currentUrl = window.location.href;
    if (currentUrl.indexOf('help') !== -1) {
        let helpIcon = document.getElementById('helpIcon');
        helpIcon.style.display = 'none';
    }
}

/**
 * This function generates the initials of the username or guest
 * 
 */
function renderLettersByName(lettersDiv) {
    if ((authorized === 'guest')) {
        lettersDiv.innerHTML = 'GU';
    } else {
        let userName = users[currentUser].name;
        lettersDiv.innerHTML = contactNamesLetters(userName);
    }
}

/**
 * This function renders the letters of first and last name of the user or the contacts
 * 
 */
function contactNamesLetters(name) {
    let letters;
    let firstLetter = name.charAt(0); // first letter of first name
    let spaceIndex = name.indexOf(' '); // index from space between first and last name
    let secondLetter = ''; // initialise of second letter
    if (spaceIndex !== -1 && spaceIndex < name.length - 1) {
        secondLetter = name.charAt(spaceIndex + 1); // second letter of last name
    }
    letters = firstLetter + secondLetter;
    return letters;
}

/**
 * This function creates the popup menu with links for header
 * 
 */
function openHeaderPopupLinks() {
    let headerLinks = document.getElementById('headerSymbolPopup');
    if (headerLinks.style.display === 'flex') {
        headerLinks.style.display = 'none'
    } else {
        headerLinks.style.display = 'flex'
    }
}

/**
 * This function opens the external links with an extension of the url address
 *
 */
function openExternalLink(link) {
    let url = `./${link}.html`;
    let targetUrl = url + '?external';
    window.open(targetUrl, '_blank');
}

/**
 * This function sets the animation of elements
 *
 */
function moveContainerIn(container) {
    container.classList.remove('outside');
    container.classList.remove('animation-out');
    container.classList.add('centered');
    container.classList.add('animation-in');
}

/**
 * This function sets the animation of elements
 *
 */
function moveContainerOut(container) {
    container.classList.remove('centered');
    container.classList.remove('animation-in');
    container.classList.add('outside');
    container.classList.add('animation-out');
}

/**
 * This function sets the animation of elements
 *
 */
function moveContainerUp(container) {
    container.classList.remove('outside-down');
    container.classList.remove('animation-down');
    container.classList.add('centered-up');
    container.classList.add('animation-up');
}

/**
 * This function sets the animation of elements
 *
 */
function moveContainerDown(container) {
    container.classList.remove('centered-up');
    container.classList.remove('animation-up');
    container.classList.add('outside-down');
    container.classList.add('animation-down');
}

/**
 * This function closes every popup
 * 
 */
function displayNonePopup(popup) {
    popup.style.display = 'none';
}

/**
 * This function resets the localStorage and redirects the user to login after logout
 * 
 */
function clickLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('logged');
    localStorage.removeItem('remember');
    setTimeout(() => {
        window.location.href = `./login.html?msg=you are logged out`;
    }, 500);
}

/**
 * This function initialize the popup message after reloading tasks or contacts
 * 
 */
function showGuestPopupMessageForReload(div, messageText) {
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
        generateGuestMessageTextForReload(div, messageText); // text for message is outsourced in renderHTML.js
        div.style.display = 'flex';
    }, 800);
    setTimeout(function () {
        closePopupAutomaticly(div);
    }, popupCloseTime);
}

/**
 * This function initialize the message popup for the limited access as guest
 * 
 */
function showGuestPopupMessage(div, messageText) {
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
        generateGuestMessageText(div, messageText); // text for message is outsourced in renderHTML.js
        div.style.display = 'flex';
    }, 800);
    setTimeout(function () {
        closePopupAutomaticly(div);
    }, popupCloseTime);
}

/**
 * This function closes the message popup by onclick
 * 
 */
function closeGuestPopupMessage(div) {
    div.style.display = 'none';
    document.body.style.overflow = 'scroll';
}

/**
 * This function will automatically close the message popup after some time
 * 
 */
function closePopupAutomaticly(div) {
    div.style.display = 'none';
    document.body.style.overflow = 'scroll';
}
