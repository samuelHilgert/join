// TEST für sidebar Farbwechsel bei click auf Menü-Element


document.addEventListener("DOMContentLoaded", function() {
    // Suchen Sie nach dem Element mit der ID 'sidebar-sum'
    var sidebarSum = document.getElementById("sidebar-sum");

    // Überprüfen Sie, ob das Element existiert, bevor Sie die Event-Handler anhängen
    if (sidebarSum) {
        // Fügen Sie einen Event-Listener hinzu, um den :active-Status beim Klicken beizubehalten
        sidebarSum.addEventListener("click", function() {
            // Fügen Sie die Klasse .sidebar-bg-focus hinzu
            this.classList.add("sidebar-bg-focus");

            // Speichern Sie den :active-Status im localStorage
            localStorage.setItem("sidebarActive", "sidebar-sum");
        });
    }

    // Überprüfen Sie, ob der :active-Status im localStorage gespeichert ist und setzen Sie ihn beim Laden der Seite zurück
    var activeLink = localStorage.getItem("sidebarActive");
    if (activeLink) {
        document.getElementById(activeLink).classList.add("sidebar-bg-focus");
    }
});