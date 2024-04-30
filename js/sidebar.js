// TEST FÜR SIDEBAR LINKS
function setBackgroundcolorSidebarLinks() {
    let url = window.location.pathname;
    let sidebarLinks = getSidebarLinks();

    sidebarLinks.forEach((sidebarLink) => {
        let href = sidebarLink.getAttribute('href');
        if (url === href) {
            sidebarLink.classList.add('sidebar-bg-focus');
            console.log('TEST');
        } else {
            sidebarLink.classList.remove('sidebar-bg-focus');
        }
    });
}

function getSidebarLinks() {
    return document.querySelectorAll('.sidebar-links .sidebar-menu');
}

document.addEventListener('DOMContentLoaded', function () {
    // Hier wird der Ereignislistener hinzugefügt, sobald das DOM geladen ist
    let sidebarLinks = document.querySelectorAll('.sidebar-menu'); // Auswahl aller Sidebar-Links

    // Iteration über alle Sidebar-Links
    sidebarLinks.forEach((link) => {
        link.addEventListener('click', function (event) {
            setBackgroundcolorSidebarLinks(); // Aufruf der Funktion zum Setzen der Hintergrundfarbe
        });
    });
});

function backToLegalOrSummary() {
    let currentUrl = window.location.href;
    if (currentUrl.indexOf('legal-notice.html?external') !== -1) {
        window.location.href = `./privacy-policy.html?external`;
    } else if (currentUrl.indexOf('privacy-policy.html?external') !== -1) {
        window.location.href = `./login.html`;
    } else if (currentUrl.indexOf('legal-notice.html') !== -1) {
        window.location.href = `./privacy-policy.html`;
    } else if (currentUrl.indexOf('privacy-policy.html') !== -1) {
        window.location.href = `./summary.html`;
    }
}

// TEST 2

function setBackgroundcolorSidebarLinks() {
    let currentPagePath = window.location.pathname;
    document.querySelectorAll('.sidebar-links .sidebar-menu').forEach((link) => {
        let isActive = new URL(link.href, document.baseURI).pathname === currentPagePath;
        link.classList.toggle('sidebar-bg-focus', isActive);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setBackgroundcolorSidebarLinks(); // Setzen der Hintergrundfarbe beim Laden der Seite

    // Ereignislistener für Klicks auf die Sidebar-Links hinzufügen
    document.querySelectorAll('.sidebar-links .sidebar-menu').forEach((link) => {
        link.addEventListener('click', function () {
            setBackgroundcolorSidebarLinks(); // Setzen der Hintergrundfarbe nach einem Klick
        });
    });
});

function getCurrentlySidebarLink() {
    let currentUrl = window.location.href;
    let position;
    if (currentUrl.indexOf('summary') !== -1) {
        position = 0;
        changeBgColorSidebarLink(position);
    }
    if (currentUrl.indexOf('add-task') !== -1) {
        position = 1;
        changeBgColorSidebarLink(position);
    }
    if (currentUrl.indexOf('board') !== -1) {
        position = 2;
        changeBgColorSidebarLink(position);
    }
    if (currentUrl.indexOf('contacts') !== -1) {
        position = 3;
        changeBgColorSidebarLink(position);
    }
    if (currentUrl.indexOf('external') !== -1) {
        let sidebarLinks = document.getElementById('sidebarLinks');
        sidebarLinks.style.display = 'none';
    }
    if (currentUrl.indexOf('privacy-policy') !== -1) {
        let legalSidebar = document.getElementsByClassName('sidebar-legal-element')[0];
        legalSidebar.style.backgroundColor = 'rgba(9, 25, 49, 1)';
        let headerSymbols = document.getElementById('headerSymbols');
        headerSymbols.style.display = 'none';
    }
    if (currentUrl.indexOf('legal-notice') !== -1) {
        let legalSidebar = document.getElementsByClassName('sidebar-legal-element')[1];
        legalSidebar.style.backgroundColor = 'rgba(9, 25, 49, 1)';
        let headerSymbols = document.getElementById('headerSymbols');
        headerSymbols.style.display = 'none';
    }
}

function changeBgColorSidebarLink(position) {
    let sidebarMenu = document.getElementsByClassName('sidebar-menu')[position];
    sidebarMenu.style.backgroundColor = 'rgba(9, 25, 49, 1)';
}

function openSidebarLegalLink(link) {
    let currentUrl = window.location.href;
    if (currentUrl.indexOf('external') !== -1) {
        let url = `./${link}.html`;
        let targetUrl = url + '?external';
        window.location.href = targetUrl;
    }
    else {
        let targetUrl = `./${link}.html`;
        window.location.href = targetUrl;
    }

}