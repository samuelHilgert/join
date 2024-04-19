// TEST für sidebar Farbwechsel bei click auf Menü-Element


document.addEventListener("DOMContentLoaded", function() {
    var sidebarLinks = document.querySelector(".sidebar-links");

    sidebarLinks.addEventListener("click", function(event) {
        var target = event.target;

        // Überprüfen, ob das geklickte Element eine Sidebar-Link ist
        if (target.classList.contains("sidebar-menu")) {
            // Entfernen Sie die aktive Klasse von allen Links
            sidebarLinks.querySelectorAll(".sidebar-menu").forEach(function(link) {
                link.classList.remove("active");
            });
            // Fügen Sie die aktive Klasse zum geklickten Link hinzu
            target.classList.add("active");
        }
    });
});