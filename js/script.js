let users = [];
let currentUser;
let loggedAsGuest = false;
let rememberStatus = [];
let remember = false;
let setResetExpiryTime = 3;
let popupCloseTime = 8000;

/**
 * This is a function to initialize render functions 
 * 
 */
async function init() {
    await loadRememberStatus();
    await loadUserData();
    getCurrentUserId();
    checkUnauthorizedOpening();
    await includeHTML();
    getCurrentlySidebarLink();
    hideHelpIcon();

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
                console.log('Du wärst längere Zeit nicht aktiv, melde dich bitte erneut an!');
                // clearInterval(intervalId); // Stoppe die Überprüfung, wenn die Zeit abgelaufen ist
                resetLoginValues();
                setTimeout(firstLogin, 1000);
            }
            // }
        }
    }, 30000); // repeat query every 30 seconds

    // Überprüfe, ob du dich auf der Seite summary.html oder contacts.html befindest
    if (document.location.pathname === '/summary.html') {
        await resetExpiryTime();
        renderSummary(); // Rufe renderSummary() nur auf, wenn du dich auf der summary.html-Seite befindest
    } else if (document.location.pathname === '/contacts.html') {
        await resetExpiryTime();
        await updateContacts();
        renderContacts(); // Rufe renderContacts() nur auf, wenn du dich auf der contacts.html-Seite befindest
    } else if (document.location.pathname === '/board.html') {
        await resetExpiryTime();
        await updateBoardTasks();
        renderBoardTasks(); 
    }
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

async function loadRememberStatus() {
    try {
        rememberStatus = JSON.parse(await getItem('remember_status'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

//rememberStatus[0].activateContent = activateContent;

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
