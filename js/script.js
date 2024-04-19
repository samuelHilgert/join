/**
 * this is a function to initialize render functions 
 * 
 */
async function init() {
    await includeHTML();
    setBackgroundcolorSidebarLinks();
    updateHTML(); // load tasks in board.html
    }

/**
 * this is a function to include outsourced html elements
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


// TEST FÜR SIDEBAR LINKS BACKGROUNDCOLOR

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