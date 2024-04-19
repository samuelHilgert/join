// TEST für sidebar Farbwechsel bei click auf Menü-Element



function setBackgroundcolorSidebarLinks() {
    let url = window.location.pathname;
    let sidebarLinks = getSidebarLinks();

    sidebarLinks.forEach((sidebarLink) => {
        let href = sidebarLink.getAttribute('href');
        if (url === href) {
            sidebarLink.classList.add('sidebar-bg-focus');
        } else {
            sidebarLink.classList.remove('sidebar-bg-focus');
        }
    });
}


function getSidebarLinks() {
    return document.querySelectorAll('sidebar-links .sidebar-menu');
}