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