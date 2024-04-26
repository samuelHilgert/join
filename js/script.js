let users = [];
let currentUser;
let loggedAsGuest = false;
let rememberStatus = [];
let remember = false;

/**
 * This is a function to initialize render functions 
 * 
 */
async function init() {
    await includeHTML();
    await loadRememberStatus();
    await loadUserData();
    getCurrentUserId();
    getCurrentlySidebarLink();
    hideHelpIcon();

    // Überprüfe, ob du dich auf der Seite summary.html oder contacts.html befindest
    if (document.location.pathname === '/summary.html') {
        renderSummary(); // Rufe renderSummary() nur auf, wenn du dich auf der summary.html-Seite befindest
    } else if (document.location.pathname === '/contacts.html') {
        await updateContacts();
        renderContacts(); // Rufe renderContacts() nur auf, wenn du dich auf der contacts.html-Seite befindest
    }
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

async function loadRememberStatus() {
    try {
        rememberStatus = JSON.parse(await getItem('remember_status'));
    } catch (e) {
        console.error('Loading error:', e);
    }
    setRememberValue();
}

function setRememberValue() {
    remember = rememberStatus[0]['remember_status'];
}

async function loadUserData() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

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
    localStorage.removeItem('user');
    localStorage.removeItem('logged');
    sessionStorage.removeItem('user');
    localStorage.removeItem('remember');
    setTimeout(forwardAfterLogout, 500);
}

function forwardAfterLogout() {
    window.location.href = `./login.html?msg=Du bist abgemeldet`;
}