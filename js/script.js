let users = [];
let contacts = [];
let tasks = [];
let rememberStatus = [];
let currentUser;
let loggedAsGuest = false;
let remember = false;
let setResetExpiryTime = 2832323; // set logout time
let popupCloseTime = 8000; // set popup display time

/**
 * This is a function to initialize render functions 
 * 
 */
async function init() {
    getCurrentUserId();
    await loadUserData();
    await loadRememberStatus();

    await updateUserData();

    checkUnauthorizedOpening();
    await includeHTML();
    getCurrentlySidebarLink();
    hideHelpIcon();
    renderHeaderUserName();

    // Überprüfe, ob die aktuelle Zeit größer oder gleich dem Ablaufdatum ist
    setInterval(function () {
        let expiryTime = rememberStatus[0].expiryDate;
        if (rememberStatus[0].remember_status === false) {
            /* if () {
              
              } else { */
            let now = new Date().getMinutes(); // .toLocaleString('de-DE');
            if (now >= expiryTime) { // let currentTime = now.getMinutes();
                // Die Zeit ist abgelaufen
                // Führe hier die entsprechenden Aktionen aus, z.B. den Benutzer abmelden
                console.log('Du warst längere Zeit nicht aktiv, melde dich bitte erneut an!');
                // clearInterval(intervalId); // Stoppe die Überprüfung, wenn die Zeit abgelaufen ist
                resetLoginValues();
                setTimeout(firstLogin, 1000);
            }
            // }
        }
    }, 30000); // repeat query every 30 seconds
    await initiateIndividualFunctions();
}

/**
 * query which page is visited and launch functions
 * 
 */
async function initiateIndividualFunctions() {
    if (document.location.pathname === '/summary.html') {
        await resetExpiryTime();
        renderSummary();
    } else if (document.location.pathname === '/add-task.html') {
        await resetExpiryTime();
        await updateTaskContacts();
    } else if (document.location.pathname === '/board.html') {
        await resetExpiryTime();
        await updateUserData();
        await renderBoardTasks();
    } else if (document.location.pathname === '/contacts.html') {
        await resetExpiryTime();
        await updateUserData();
        await renderContacts();
    } else if (document.location.pathname === '/privacy-policy.html') {
        await resetExpiryTime();
    } else if (document.location.pathname === '/legal-notice.html') {
        await resetExpiryTime();
    } else if (document.location.pathname === '/help.html') {
        await resetExpiryTime();
    }
} 

/**
 * this is a function to get the current user-array-position from the user on the remote server
 * 
 */
function getCurrentUserId() {
    let savedDataSesssionStorage = sessionStorage.getItem('user');
    let savedDataLocalStorage = localStorage.getItem('user');
    let loggedStatusLocalStorage = localStorage.getItem('logged');
    if (loggedStatusLocalStorage) {
        loggedAsGuest = true;
    }
    else {
        if (savedDataSesssionStorage) {
            currentUser = savedDataSesssionStorage;
        } else {
            if (savedDataLocalStorage) {
            currentUser = savedDataLocalStorage;
            }
        }
    }
}

/**
 * this function loads the user data from the remote server
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
 * this function loads the value, whether the user logged in with the remember option
 * 
 */
async function loadRememberStatus() {
    try {
        rememberStatus = JSON.parse(await getItem('remember_status'));
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
async function updateUserData() {
    if (loggedAsGuest === true) {
        await loadExampleContacts();
        await loadExampleTasks();
    } else {
        let currentUserContacts = users[currentUser].contacts;
        let currentUserTasks = users[currentUser].tasks;
        if (currentUserContacts.length === 0 || currentUserTasks.length === 0) {
            await loadExampleContacts();
            await pushContactsOnRemoteServer();
            await loadExampleTasks();
            await pushTasksOnRemoteServer();
        }
        else {
            contacts = users[currentUser].contacts;
            tasks = users[currentUser].tasks;
        }
    }
}


/**
 * This is a function which includes the sample contacts from the contacts.json JSON-Document 
 * 
 */
async function loadExampleContacts() {
    let resp = await fetch('./JSON/contacts.json');
    contacts = await resp.json();
}

async function pushContactsOnRemoteServer() {
    users[currentUser].contacts = contacts;
    await setItem('users', JSON.stringify(users));
}



async function loadExampleTasks() {
    let resp = await fetch('./JSON/tasks.json');
    tasks = await resp.json();
}

async function pushTasksOnRemoteServer() {
    users[currentUser].tasks = tasks;
    await setItem('users', JSON.stringify(users));
}

/**
 * This feature secures unauthorized opening of pages via the URL by copying and pasting.
 * 
 */
function checkUnauthorizedOpening() {
    let valueLogged = localStorage.getItem('logged');
    let valueUser = localStorage.getItem('user');
    if (valueLogged === null && valueUser === null) {
        firstLogin();
    }
}

async function resetExpiryTime() {
    rememberStatus[0].expiryDate = new Date().getMinutes() + setResetExpiryTime;
    await setItem('remember_status', JSON.stringify(rememberStatus));
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

function renderHeaderUserName() {
    if (loggedAsGuest === true) {
        document.getElementById('headerUserName').innerHTML = 'GU';
    } else {
        let firstLetter = users[currentUser].name.charAt(0); // Erster Buchstabe des Vornamens
        let spaceIndex = users[currentUser].name.indexOf(' '); // Index des Leerzeichens zwischen Vor- und Nachnamen
        let secondLetter = ''; // Initialisieren Sie den zweiten Buchstaben
        if (spaceIndex !== -1 && spaceIndex < users[currentUser].name.length - 1) {
            secondLetter = users[currentUser].name.charAt(spaceIndex + 1); // Zweiter Buchstabe des Nachnamens
        }
        // Setzen Sie den Header-Text mit den ersten Buchstaben des Vor- und Nachnamens
        document.getElementById('headerUserName').innerHTML = firstLetter + secondLetter;
    }
}

let headerOpenPopupClicked = false;

function openHeaderPopupLinks() {
    if (!headerOpenPopupClicked) {
        let headerSymbolPopup = document.getElementById('headerSymbolPopup');
        headerSymbolPopup.style.display = 'flex';
        headerOpenPopupClicked = true;
    }
    else {
        let headerSymbolPopup = document.getElementById('headerSymbolPopup');
        headerSymbolPopup.style.display = 'none';
        headerOpenPopupClicked = false;
    }
}

function openHelp() {
    openHelpClicked = true;
    let targetUrl = `./help.html`;
    window.location.href = targetUrl;
}

function hideHelpIcon() {
    let currentUrl = window.location.href;
    if (currentUrl.indexOf('help') !== -1) {
        let helpIcon = document.getElementById('helpIcon');
        helpIcon.style.display = 'none';
    }
}

function openExternalLink(link) {
    let url = `./${link}.html`;
    let targetUrl = url + '?external';
    window.open(targetUrl, '_blank');
}

function moveContainerIn(container) {
    container.classList.remove('outside');
    container.classList.remove('animation-out');
    container.classList.add('centered');
    container.classList.add('animation-in');
}

function moveContainerOut(container) {
    container.classList.remove('centered');
    container.classList.remove('animation-in');
    container.classList.add('outside');
    container.classList.add('animation-out');
}

function displayNonePopup(popup) {
    popup.style.display = 'none';
}

function moveContainerUp(container) {
    container.classList.remove('outside-down');
    container.classList.remove('animation-down');
    container.classList.add('centered-up');
    container.classList.add('animation-up');
}

function moveContainerDown(container) {
    container.classList.remove('centered-up');
    container.classList.remove('animation-up');
    container.classList.add('outside-down');
    container.classList.add('animation-down');
}


function clickLogout() {
    resetLoginValues();
    setTimeout(forwardAfterLogout, 500);
}

function resetLoginValues() {
    localStorage.removeItem('user');
    localStorage.removeItem('logged');
    sessionStorage.removeItem('user');
    localStorage.removeItem('remember');
}

function forwardAfterLogout() {
    window.location.href = `./login.html?msg=Du bist abgemeldet`;
}

function firstLogin() {
    window.location.href = `./login.html`;
}

function showGuestPopupMessageForReload(div, messageText) {
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
        generateGuestMessageTextForReload(div, messageText);
        div.style.display = 'flex';
    }, 800);
    setTimeout(function () {
        closePopupAutomaticly(div);
    }, popupCloseTime);
}

function generateGuestMessageTextForReload(div, messageText) {
    messageText.innerHTML = `
<div onclick="closeGuestPopupMessage(${div.id})"><a class="link-style guestPopupLinkStyle">Close</a></div>
<h5>Oops!</h5>
<div class="d_c_c_c gap-10">
<p>It seems like you need help.</p>
<p>We'll show you a few examples.</p>
</div>
<div><a class="link-style guestPopupLinkStyle" onclick="clickLogout()">Zum Login</a></div>
`;
}

function showGuestPopupMessage(div, messageText) {
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
        generateGuestMessageText(div, messageText);
        div.style.display = 'flex';
    }, 800);
    setTimeout(function () {
        closePopupAutomaticly(div);
    }, popupCloseTime);
}

function generateGuestMessageText(div, messageText) {
    messageText.innerHTML = `
<div onclick="closeGuestPopupMessage(${div.id})"><a class="link-style guestPopupLinkStyle">Close</a></div>
<h5>You are not logged in!</h5>
<div class="d_c_c_c gap-10">
<p>Please note that we will not save your changes.</p>
<p>Please log in to access all features.</p>
</div>
<div><a class="link-style guestPopupLinkStyle" onclick="clickLogout()">Zum Login</a></div>
`;
}

function closeGuestPopupMessage(div){
    div.style.display = 'none';
    document.body.style.overflow = 'scroll';
}

function closePopupAutomaticly(div) {
    div.style.display = 'none';
    document.body.style.overflow = 'scroll';
}
