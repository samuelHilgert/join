/**
 * Sets the background color for the sidebar links based on the current page.
 * If the link matches the current page, adds the class 'sidebar-bg-focus',
 * otherwise removes this class.
 */
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
    return document.querySelectorAll('.sidebar-links .sidebar-menu');
}

/**
 * Adds event listeners to the sidebar menu links when the DOM content is loaded.
 * When a sidebar menu link is clicked, it triggers the function to set the background color for sidebar menu links.
 */
document.addEventListener('DOMContentLoaded', function () {
    let sidebarLinks = document.querySelectorAll('.sidebar-menu');
    sidebarLinks.forEach((link) => {
        link.addEventListener('click', function (event) {
            setBackgroundcolorSidebarLinks();
        });
    });
});

/**
 * Redirects the user to legal or summary pages based on the current URL.
 * If the current URL contains 'legal-notice.html?external', redirects to 'privacy-policy.html?external'.
 * If the current URL contains 'privacy-policy.html?external', redirects to 'login.html'.
 * If the current URL contains 'legal-notice.html', redirects to 'privacy-policy.html'.
 * If the current URL contains 'privacy-policy.html', redirects to 'summary.html'.
 */
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

/**
 * Sets the background color for the sidebar links based on the current page.
 */
function setBackgroundcolorSidebarLinks() {
    let currentPagePath = window.location.pathname;
    document.querySelectorAll('.sidebar-links .sidebar-menu').forEach((link) => {
        let isActive = new URL(link.href, document.baseURI).pathname === currentPagePath;
        link.classList.toggle('sidebar-bg-focus', isActive);
    });
}

/**
 * Adds event listeners to the sidebar menu links when the DOM content is loaded.
 * Sets the background color for the sidebar links when the page is loaded.
 * When a sidebar menu link is clicked, it triggers the function to set the background color for sidebar links.
 */
document.addEventListener('DOMContentLoaded', function () {
    setBackgroundcolorSidebarLinks();
    document.querySelectorAll('.sidebar-links .sidebar-menu').forEach((link) => {
        link.addEventListener('click', function () {
            setBackgroundcolorSidebarLinks();
        });
    });
});

/**
 * Sets the background color for the sidebar link based on the current URL.
 * @param {string} currentUrl The URL of the current page.
 */
function setSidebarLinkBackground(currentUrl) {
    const keywords = ['summary', 'add-task', 'board', 'contacts'];
    let position = keywords.findIndex(keyword => currentUrl.includes(keyword));
    if (position !== -1) {
        changeBgColorSidebarLink(position);
    }
}

/**
 * Handles the behavior of the sidebar links for external pages.
 * If the current URL contains 'external', hides the sidebar links.
 * @param {string} currentUrl The URL of the current page.
 */
function handleExternalLink(currentUrl) {
    if (currentUrl.includes('external')) {
        let sidebarLinks = document.getElementById('sidebarLinks');
        sidebarLinks.style.display = 'none';
    }
}

/**
 * Handles the behavior of the sidebar links for legal pages.
 * If the current URL contains 'privacy-policy', sets the background color for the legal sidebar.
 * If the current URL contains 'legal-notice', sets the background color for the legal sidebar.
 * @param {string} currentUrl The URL of the current page.
 */
function handleLegalPages(currentUrl) {
    if (currentUrl.includes('privacy-policy')) {
        setLegalSidebarBackground(0);
    }
    if (currentUrl.includes('legal-notice')) {
        setLegalSidebarBackground(1);
    }
}

/**
 * Sets the background color and hides header symbols for a legal sidebar element.
 * @param {number} index The index of the legal sidebar element.
 */
function setLegalSidebarBackground(index) {
    let legalSidebar = document.getElementsByClassName('sidebar-legal-element')[index];
    legalSidebar.style.backgroundColor = 'rgba(9, 25, 49, 1)';
    let headerSymbols = document.getElementById('headerSymbols');
    headerSymbols.style.display = 'none';
}

/**
 * Checks the current URL and performs actions for sidebar links, external links, and legal pages.
 * @param {string} currentUrl The URL of the current page.
 */
function getCurrentlySidebarLink() {
    let currentUrl = window.location.href;
    setSidebarLinkBackground(currentUrl);
    handleExternalLink(currentUrl);
    handleLegalPages(currentUrl);
}

/**
 * Changes the background color for a specific sidebar menu link.
 * @param {number} position The position of the sidebar menu link.
 */
function changeBgColorSidebarLink(position) {
    let sidebarMenu = document.getElementsByClassName('sidebar-menu')[position];
    sidebarMenu.style.backgroundColor = 'rgba(9, 25, 49, 1)';
}

/**
 * Opens a legal link in the sidebar, considering if it's an external link.
 * @param {string} link The link to open.
 */
function openSidebarLegalLink(link) {
    let currentUrl = window.location.href;
    if (currentUrl.indexOf('external') !== -1) {
        let url = `./${link}.html`;
        let targetUrl = url + '?external';
        window.location.href = targetUrl;
    } else {
        let targetUrl = `./${link}.html`;
        window.location.href = targetUrl;
    }
}