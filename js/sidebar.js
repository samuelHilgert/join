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

document.addEventListener('DOMContentLoaded', function() {
    // Hier wird der Ereignislistener hinzugefügt, sobald das DOM geladen ist
    let sidebarLinks = document.querySelectorAll('.sidebar-menu'); // Auswahl aller Sidebar-Links

    // Iteration über alle Sidebar-Links
    sidebarLinks.forEach((link) => {
        link.addEventListener('click', function(event) {
            setBackgroundcolorSidebarLinks(); // Aufruf der Funktion zum Setzen der Hintergrundfarbe
        });
    });
});


// TEST 2


function setBackgroundcolorSidebarLinks() {
    let currentPagePath = window.location.pathname;
    document.querySelectorAll('.sidebar-links .sidebar-menu').forEach((link) => {
        let isActive = new URL(link.href, document.baseURI).pathname === currentPagePath;
        link.classList.toggle('sidebar-bg-focus', isActive);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setBackgroundcolorSidebarLinks(); // Setzen der Hintergrundfarbe beim Laden der Seite

    // Ereignislistener für Klicks auf die Sidebar-Links hinzufügen
    document.querySelectorAll('.sidebar-links .sidebar-menu').forEach((link) => {
        link.addEventListener('click', function() {
            setBackgroundcolorSidebarLinks(); // Setzen der Hintergrundfarbe nach einem Klick
        });
    });
});