// TEST für sidebar Farbwechsel bei click auf Menü-Element


document.addEventListener("DOMContentLoaded", function() {
    var sidebarLinks = document.querySelectorAll(".sidebar-menu");

    sidebarLinks.forEach(function(link) {
        link.addEventListener("click", function(event) {
            // Speichern Sie den Index des geklickten Links im localStorage
            localStorage.setItem("activeLink", Array.from(sidebarLinks).indexOf(this));
        });
    });
});


document.addEventListener("DOMContentLoaded", function() {
    var activeLinkIndex = localStorage.getItem("activeLink");
    if (activeLinkIndex !== null) {
        var sidebarLinks = document.querySelectorAll(".sidebar-menu");
        sidebarLinks.forEach(function(link, index) {
            if (index.toString() === activeLinkIndex) {
                link.classList.add("active");
            }
        });
    }
});