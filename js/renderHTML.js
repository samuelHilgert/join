/**
 * Renders HTML for the initial letter and a parting line.
 * @param {string} firstLetter - The first letter of the section or list to be displayed.
 * @returns {string} - HTML content for displaying the first letter with a parting line.
 */
function renderLetterAndPartinglineHTML(firstLetter) {
    return `
    <div class="contactlist-letterbox">
        <div class="contact-letter gap-8">
            <p>${firstLetter}</p>
        </div>
        <div class="parting-line"></div>
    </div>
    `;
}


/**
 * Renders HTML for a small contact list item.
 * @param {string} id - The unique identifier for the contact.
 * @param {string} firstLetter - The first letter of the contact's first name.
 * @param {string} firstLetterSurname - The first letter of the contact's surname.
 * @param {string} name - The full name of the contact.
 * @param {string} mail - The email address of the contact.
 * @returns {string} - HTML content for displaying a contact in a list with basic information.
 */
function renderContactListHTML(
    id,
    firstLetter,
    firstLetterSurname,
    name,
    mail
) {
    return `
    <div class="contact-small" id="${id}" onclick="openContactInfo('${id}')">
        <div class="contact-circle d_f_c_c">
            <div class="contact-circle-letters">${firstLetter}${firstLetterSurname}</div>
        </div>
        <div class="contact-name-mail-wrapper">
            <div class="contact-name">${name}</div>
            <div class="contact-mail">${mail}</div>
        </div>
    </div>
    `;
}


/**
 * Renders HTML for displaying detailed contact information.
 * @param {string} color - Background color for the contact's avatar circle.
 * @param {string} firstLetter - The first letter of the contact's first name.
 * @param {string} firstLetterSurname - The first letter of the contact's surname.
 * @param {string} name - The full name of the contact.
 * @param {string} contactId - The unique identifier for the contact.
 * @param {string} mail - The email address of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {string} - HTML content for displaying detailed contact information including actions like edit and delete.
 */
function renderContactInformationHTML(
    color,
    firstLetter,
    firstLetterSurname,
    name,
    contactId,
    mail,
    phone
) {
    return `
    <div class="animation-in">
        <div class="contact-card-header">
            <div class="circle-big d_f_c_c" style="background-color:${color};">${firstLetter}${firstLetterSurname}</div>
            <div class="contact-card-header-text gap-8">
                <span class="contact-card-header-text-span">${name}</span>
                <div class="d_f_fs_c contact-card-header-icons gap-30">
                    <div class="d_f_c_c gap-8 header-icons-wrapper" onclick="openEditContactForm('${contactId}')">
                        <svg class="contact-header-svg" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" />
                        </svg>
                        <span class="contact-header-span">Edit</span>
                    </div>
                    <div class="d_f_c_c gap-8 header-icons-wrapper" onclick="deleteContact('${contactId}')">
                        <svg class="contact-header-svg" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" />
                        </svg>
                        <span class="contact-header-span">Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <span class="contact-name d_f pad-y-20">Contact Information</span>
        <div class="mail-phone-wrapper gap-22">
            <div class="gap-15 mail-phone-wrapper">
                <span class="span-thick">Email</span>
                <span class="contact-mail">${mail}</span>
            </div>
            <div class="gap-15 mail-phone-wrapper">
                <span class="span-thick">Phone</span>
                <span>${phone}</span>
            </div>
        </div>
    </div>
    `;
}


/**
 * Renders HTML for adding a new contact form.
 * This form allows users to input contact information and submit it to create a new contact.
 * It includes fields for the contact's name, email, and phone number.
 * @returns {string} - HTML content for the add contact form.
 */
function renderAddContactContainerHTML() {
    return `
    <div class="add-contact-container" id="addContactContainer" onclick='doNotClose(event)'>
            <div class="add-contact-container-left">
                <img class="add-contact-img" src="./assets/img/logo2.png" alt="">
                <span class="add-contact-span-big">Add Contact</span>
                <span class="add-contact-span-small">Tasks are better with a team!</span>
                <div class="horizontal-partingline"></div>
            </div>
            <div class="add-contact-container-right">
                <div class="d_f_fe_c close-contact-btn">
                    <div class="add-contact-container-right-img-wrapper d_c_c_c" onclick="closeAddContactForm()">
                        <img class="add-contact-container-right-img mobile-add-contact-container-right-img" src="./assets/img/close.svg" alt="">
                    </div>
                </div>
                <div class="add-contact-container-right-bottom-wrapper">
                    <div class="add-contact-container-right-bottom">
                        <img class="contact-grey-svg" src="./assets/img/contact-picture.svg" alt="">
                        <form class="contact-form" id="contactForm" onsubmit="validateAndAddContact(event); return false;">
                            <input id="inputAddContactName" class="contact-input-style input-name input-font" type="text" placeholder="Name" required>
                            <input id="inputAddContactMail" class="contact-input-style input-email input-font" type="email" placeholder="Email" required>
                            <input id="inputAddContactPhone" class="contact-input-style input-phone input-font" type="text" placeholder="Phone" required>
                            <div class="btn-wrapper">
                                <button type="button" class="clear-btn gap-10 mobile-clear-btn" onclick="closeAddContactForm()">Cancel
                                    <svg class="contact-header-svg" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 13.4L7.10005 18.3C6.91672 18.4834 6.68338 18.575 6.40005 18.575C6.11672 18.575 5.88338 18.4834 5.70005 18.3C5.51672 18.1167 5.42505 17.8834 5.42505 17.6C5.42505 17.3167 5.51672 17.0834 5.70005 16.9L10.6 12L5.70005 7.10005C5.51672 6.91672 5.42505 6.68338 5.42505 6.40005C5.42505 6.11672 5.51672 5.88338 5.70005 5.70005C5.88338 5.51672 6.11672 5.42505 6.40005 5.42505C6.68338 5.42505 6.91672 5.51672 7.10005 5.70005L12 10.6L16.9 5.70005C17.0834 5.51672 17.3167 5.42505 17.6 5.42505C17.8834 5.42505 18.1167 5.51672 18.3 5.70005C18.4834 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4834 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4834 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4834 18.1167 18.3 18.3C18.1167 18.4834 17.8834 18.575 17.6 18.575C17.3167 18.575 17.0834 18.4834 16.9 18.3L12 13.4Z" />
                                    </svg>
                                </button>
                                <button type="submit" class="btn gap-10" >Create Contact<img
                                        src="assets/img/check.svg" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}


/**
 * Renders HTML for editing an existing contact.
 * This form is pre-filled with the contact's current information, allowing users to update it.
 * It includes the contact's name, email, and phone, with options to save changes or delete the contact.
 * @param {string} color - Background color for the contact's initials circle.
 * @param {string} firstLetter - First letter of the contact's first name.
 * @param {string} firstLetterSurname - First letter of the contact's surname.
 * @param {string} name - Full name of the contact.
 * @param {string} mail - Email address of the contact.
 * @param {string} phone - Phone number of the contact.
 * @param {string} contactId - Unique identifier for the contact.
 * @returns {string} - HTML content for the edit contact form.
 */
function renderEditContactHTML(
    color,
    firstLetter,
    firstLetterSurname,
    name,
    mail,
    phone,
    contactId
) {
    return `
    <div class="add-contact-container" id="editContactContainer" onclick='doNotClose(event)'>
            <div class="edit-contact-container-left">
                <img class="edit-contact-img" src="./assets/img/logo2.png" alt="">
                <span class="add-contact-span-big">Edit Contact</span>
                <div class="horizontal-partingline"></div>
            </div>
            <div class="add-contact-container-right">
                <div class="d_f_fe_c close-contact-btn">
                    <div class="add-contact-container-right-img-wrapper d_c_c_c" onclick="closeEditContactForm()">
                        <img class="add-contact-container-right-img mobile-add-contact-container-right-img" src="./assets/img/close.svg" alt="">
                    </div>
                </div>
                <div class="add-contact-container-right-bottom-wrapper">
                    <div class="add-contact-container-right-bottom">
                        <div class="circle-big d_f_c_c mobile-margin-top-15" style="background-color:${color};">${firstLetter}${firstLetterSurname}</div>
                        <form class="contact-form" onsubmit="event.preventDefault(); editContact('${contactId}')">
                            <input id="newName" class="contact-input-style input-name input-font placeholder-black" type="text" value="${name}" required>
                            <input id="newMail" class="contact-input-style input-email input-font placeholder-black" type="email" value="${mail}">
                            <input id="newPhone" class="contact-input-style input-phone input-font placeholder-black" type="text" value="${phone}">
                            <div class="btn-wrapper">
                                <button type="button" class="clear-btn gap-10" onclick="deleteContact('${contactId}')">Delete</button>
                                <button type="submit" class="btn gap-10">Save
                                <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.55057 9.65L14.0256 1.175C14.2256 0.975 14.4631 0.875 14.7381 0.875C15.0131 0.875 15.2506 0.975 15.4506 1.175C15.6506 1.375 15.7506 1.6125 15.7506 1.8875C15.7506 2.1625 15.6506 2.4 15.4506 2.6L6.25057 11.8C6.05057 12 5.81724 12.1 5.55057 12.1C5.28391 12.1 5.05057 12 4.85057 11.8L0.550573 7.5C0.350573 7.3 0.25474 7.0625 0.263073 6.7875C0.271407 6.5125 0.375573 6.275 0.575573 6.075C0.775573 5.875 1.01307 5.775 1.28807 5.775C1.56307 5.775 1.80057 5.875 2.00057 6.075L5.55057 9.65Z" fill="white"/>
                                </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}


/**
 * This function returns the text for the pop-up messages when contacts or tasks are reloaded
 * 
 */
function generateGuestMessageTextForReload(div, messageText) {
    messageText.innerHTML = `
    <div onclick="closeGuestPopupMessage(${div.id})"><a class="link-style guestPopupLinkStyle">Close</a></div>
    <h5>Oops!</h5>
    <div class="d_c_c_c gap-10">
        <p>It seems like you need help.</p>
        <p>We'll show you a few examples.</p>
    </div>
    <div><a class="link-style guestPopupLinkStyle" onclick="clickLogout()">Zum Login</a></div>
    `;
}


/**
 * This function returns the text for the popup messages when the user is a guest and has used a function
 * 
 */
function generateGuestMessageText(div, messageText) {
    messageText.innerHTML = `
    <div onclick="closeGuestPopupMessage(${div.id})"><a class="link-style guestPopupLinkStyle">Close</a></div>
    <h5>You are not signed in!</h5>
    <div class="d_c_c_c gap-10">
        <p>Please note that we will not save your changes.</p>
        <p>Please sign in to get access to all features.</p>
    </div>
    <div><a class="link-style guestPopupLinkStyle" onclick="clickLogout()">Zum Login</a></div>
    `;
}


/**
 * This function renders HTML buttons with urgent, medium, and low priority settings for tasks.
 * These buttons allow the user to set the priority of a task when creating or editing it.
 */
function renderAddTaskFormButton() {
    let urgentBtn = document.getElementById(`urgentBtn-${templateIndex}`);
    let mediumBtn = document.getElementById(`mediumBtn-${templateIndex}`);
    let lowBtn = document.getElementById(`lowBtn-${templateIndex}`);
    
    urgentBtn.innerHTML = `
    <p>Urgent</p>
    <svg class="category-svg-urgent">
    <g clip-path="url(#clip0_167926_4288)">
      <path
        d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" />
      <path
        d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" />
    </g>
    <defs>
      <clipPath id="clip0_167926_4288">
        <rect width="20" height="14.5098" fill="white" transform="translate(0.748535 0.745117)" />
      </clipPath>
    </defs>
  </svg> 
    `;

    mediumBtn.innerHTML = `
    <p>Medium</p>
    <svg class="category-svg-medium">
    <g clip-path="url(#clip0_167926_4295)">
      <path
        d="M19.1526 7.72528H1.34443C1.05378 7.72528 0.775033 7.60898 0.569514 7.40197C0.363995 7.19495 0.248535 6.91419 0.248535 6.62143C0.248535 6.32867 0.363995 6.0479 0.569514 5.84089C0.775033 5.63388 1.05378 5.51758 1.34443 5.51758H19.1526C19.4433 5.51758 19.722 5.63388 19.9276 5.84089C20.1331 6.0479 20.2485 6.32867 20.2485 6.62143C20.2485 6.91419 20.1331 7.19495 19.9276 7.40197C19.722 7.60898 19.4433 7.72528 19.1526 7.72528Z" />
      <path
        d="M19.1526 2.48211H1.34443C1.05378 2.48211 0.775033 2.36581 0.569514 2.1588C0.363995 1.95179 0.248535 1.67102 0.248535 1.37826C0.248535 1.0855 0.363995 0.804736 0.569514 0.597724C0.775033 0.390712 1.05378 0.274414 1.34443 0.274414L19.1526 0.274414C19.4433 0.274414 19.722 0.390712 19.9276 0.597724C20.1331 0.804736 20.2485 1.0855 20.2485 1.37826C20.2485 1.67102 20.1331 1.95179 19.9276 2.1588C19.722 2.36581 19.4433 2.48211 19.1526 2.48211Z" />
    </g>
    <defs>
      <clipPath id="clip0_167926_4295">
        <rect width="20" height="7.45098" transform="translate(0.248535 0.274414)" />
      </clipPath>
    </defs>
  </svg> 
    `;

    lowBtn.innerHTML = `
    <p>Low</p>
    <svg class="category-svg-low">
    <path
      d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" />
    <path
      d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" />
    </svg>
    `;

    document.getElementById(`mediumBtn-${templateIndex}`).click();
}


/**
 * Renders HTML for the contact information menu in a mobile environment, including buttons for editing and deleting the contact.
 * This function is designed to be used on mobile devices, providing quick access to contact management features.
 * @param {string} contactId - The unique identifier for the contact.
 * @returns {string} - HTML string containing interactive buttons for editing and deleting a contact.
 */
function renderMobileContactinfoMenuHTML(contactId) {
    return `
    <div class="d_f_c_c gap-8 header-icons-wrapper" onclick="openEditContactForm('${contactId}')">
        <svg class="contact-header-svg" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" />
        </svg>
        <span class="contact-header-span">Edit</span>
    </div>
    <div class="d_f_c_c gap-8 header-icons-wrapper" onclick="deleteContact('${contactId}')">
        <svg class="contact-header-svg" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" />
        </svg>
        <span class="contact-header-span">Delete</span>
    </div>
    `;
}


/////////// RENDERING FOR BOARD ////////////


/**
 * This function renders the entire text of the task, when it is open
 * 
 * @param {string} todo - curent task
 * @param {string} openLabel - element.id for the label 
 * @param {string} openTitle - element.id for the title
 * @param {string} openDescription - element.id for the description
 * @param {string} openDueDate - element.id for the duedate
 * @param {string} openPriority - element.id for the priority
 */
function renderShowTaskContent(todo, openLabel, openTitle, openDescription, openDueDate, openPriority) {
    openLabel.innerHTML = `${todo["label"]}`;
    openTitle.innerHTML = `<h2><b>${todo["title"]}</b></h2>`;
    openDescription.innerHTML = `<p>${todo["description"]}</p>`;
    openDueDate.innerHTML = `
      <div class="d_f_fs_c width-20 gap-30">
          <p>Due date:</p>
      </div>
      <div class="d_f_fs_c gap-30">
          <p>${todo["dueDate"]}</p>
      </div>
      `;
    openPriority.innerHTML = `
      <div class="d_f_fs_c width-20 gap-30">
          <p>Priority:</p>
      </div>
      <div class="d_f_fs_c gap-10">
          <p>${todo["priority"]}</p>
          <div><img src="../assets/img/${getPriorityIcon(todo)}"></img></div>
      </div>
      `;
}


/**
 * This function gets the current priority icon for the selection of priority in the opened task
 * 
 * @param {string} todo - curent task
 */
function getPriorityIcon(todo) {
    let imgSrc;
    if (todo["priority"] === "Urgent") {
        imgSrc = "prio-urgent.svg";
    } else if (todo["priority"] === "Medium") {
        imgSrc = "prio-media.svg";
    } else if (todo["priority"] === "Low") {
        imgSrc = "prio-low.svg";
    }
    return imgSrc;
}


/**
 * This function renders the entire subtasks of the opened task, which are not done
 * 
 * @param {number} a - index of the current (open) subtask
 */
function renderOpenSubtasks(a) {
    return `
<div class="d_f_c_c gap-10">
<div id="taskId${currentOpenTaskId}SubtaskOpenId${a}" onclick="clickSubtaskToSwitch(${a}, this)"><img src="../assets/img/check-button-empty.svg"></div>
<p>${subtasksOpen[a]}</p>
</div>
`;
}


/**
 * This function renders the entire subtasks of the opened task, which are not done
 * 
 * @param {number} b - index of the current (done) subtask
 */
function renderDoneSubtasks(b) {
    return `
    <div class="d_f_c_c gap-10">
    <div id="taskId${currentOpenTaskId}SubtaskDoneId${b}" onclick="clickSubtaskToSwitch(${b}, this)"><img src="../assets/img/check-button-clicked.svg"></div>
    <p>${subtasksDone[b]}</p>
    </div>
    `;
}


/**
 * This function renders the "assigendTo" contacts
 * 
 * @param {string} contact - current "assignedTo" contact
 * @param {string} letters - current letters of this contact
 * @param {string} backgroundColor - background-color for the css style as html tag
 */
function renderAssignedToContactsForOpenTask(contact, letters, backgroundColor) {
    return `
    <div class="d_f_fs_c gap-10 width-max">
    <div class="d_f_c_c contact-circle-small contact-circle-small-letters" style="background-color: ${backgroundColor};">${letters}</div>
    <p>${contact}</p>
    </div>
    `;
}


/**
 * This function renders the "open" subtasks in the edit form
 * 
 * @param {string} subtask - current saved subtask text
 * @param {number} index - index of the current subtask
 */
function renderOpenSubtasksInEditForm(subtask, index) {
    return `
    <div id='subtask${index}' class='d_f_sb_c pad-x-10 subtask'>
    <span>• ${subtask}</span>
    <div class='d_f_c_c gap-5'>
      <img src="assets/img/pen_dark.svg" alt="pen" class="subtask-icon" id="subtasksOpen${index}" onclick="editSubtask(this)" />
      <div class="subtask-partingline"></div>
      <img src="assets/img/trash_dark.svg" alt="trash" class="subtask-icon" id="subtasksOpen${index}" onclick="deleteSubtask(this)" />
    </div>
  </div>
    `;
}


/**
 * This function renders the "done" subtasks in the edit form
 * 
 * @param {string} subtask - current saved subtask text
 * @param {number} index - index of the current subtask
 */
function renderDoneSubtasksInEditForm(subtask, index) {
    return `
    <div id='subtask${index}' class='d_f_sb_c pad-x-10 subtask'>
    <span>• ${subtask}</span>
    <div class='d_f_c_c gap-5'>
      <img src="assets/img/pen_dark.svg" alt="pen" class="subtask-icon" id="subtasksDone${index}" onclick="editSubtask(this)" />
      <div class="subtask-partingline"></div>
      <img src="assets/img/trash_dark.svg" alt="trash" class="subtask-icon" id="subtasksDone${index}" onclick="deleteSubtask(this)"/>
    </div>
  </div>
    `;
}


/**
 * This function generates the todo content for the todos on board
 * 
 * @param {string} task - the current task
 */
function generateTodoHTML(task) {
    return `<div class="todo d_c_sb_fs gap-10 width-max" onmousedown="startTimer(${task["id"]})" ontouchstart="startTimer()" onmouseup="clearTimer()" ontouchend="clearTimer()" onclick="openBoardTaskPopup(${task["id"]})" draggable="true" ondragstart="startDragging(${task["id"]})">
              <div class="btn-board d_f_fs_fs" id="">${task["label"]}</div>
              <h6><b>${task["title"]}</b></h6>
              <p>${task["description"]}</p>
              <div class="d_c_fs_fs width-max gap-10" id="progessSubtaskDiv${task["id"]}">
                  <div class="progress" onmouseover="showSubtasksByHovering(${task["id"]})">
                      <div class="progress-bar" id="progressBar${task["id"]}"></div>
                  </div>
                  <div class="statusText" id="statusText${task["id"]}"><span id="stubtasksDoneLength${task["id"]}">X</span>/<span id="subtasksLength${task["id"]}">XX</span><span>&nbsp;Subtasks</span></div>
              </div>
              <div class="d_f_sb_c width-max">
              <div class="d_f_c_c" id="contactsIn${task["id"]}">
              </div>
              <div id="prioIn${task["id"]}"></div>
              </div>`;
}


/**
 * This function generates the "assignedTo" contacts of the todo
 * 
 * @param {string} marginRightClass - the 
 *  * @param {string} backgroundColor - the backgroundColor for the contacts
 *  * @param {string} letters - the letters of the contacts
 */
function renderContactsForBoardTaskDiv(marginRightClass, backgroundColor, letters) {
    return `<div class="d_f_fs_c gap-10 width-max ${marginRightClass}">
    <div class="d_f_c_c contact-circle-small contact-circle-small-letters" style="background-color: ${backgroundColor};">${letters}</div>
    </div>
    `;
}


/**
 * Renders HTML for mobile-specific todo settings options.
 * @param {number} taskId - The ID of the task for which settings are being rendered.
 * @returns {string} - HTML content for task settings options on mobile devices.
 */
function renderMobileTodoSettings(taskId) {
    return `
    <div class="d_f_sb_c width-max pad-x-20">
  
    <div class="options-task-popup d_f_c_c width-max gap-10">

    <div class="d_f_c_c gap-8 header-icons-wrapper cursor-pointer" onclick="mobileTodoMove()">
    <svg class="task-popup-svg"viewBox="0 0 24 24">
    <path d="M12 2L3 12h5v10h8V12h5z" fill="currentColor"/>
  </svg>
    <span class="task-popup-span">Move</span>
  </div>

  <div class="icon-separator"></div>

    <div class="d_f_c_c gap-8 header-icons-wrapper cursor-pointer" onclick="mobileTodoDelete()">
      <svg class="task-popup-svg" viewBox="0 0 16 18">
        <path
          d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" />
      </svg>
      <span class="task-popup-span">Delete</span>
    </div>

    <div class="icon-separator"></div>

    <div class="d_f_c_c gap-8 header-icons-wrapper cursor-pointer popup-btn" data-popup-type="editTask"
      onclick="mobileTodoEdit(${taskId})">
      <svg class="task-popup-svg" viewBox="0 0 19 19">
        <path
          d="M2 17H3.4L12.025 8.375L10.625 6.975L2 15.6V17ZM16.3 6.925L12.05 2.725L13.45 1.325C13.8333 0.941667 14.3042 0.75 14.8625 0.75C15.4208 0.75 15.8917 0.941667 16.275 1.325L17.675 2.725C18.0583 3.10833 18.2583 3.57083 18.275 4.1125C18.2917 4.65417 18.1083 5.11667 17.725 5.5L16.3 6.925ZM14.85 8.4L4.25 19H0V14.75L10.6 4.15L14.85 8.4Z" />
      </svg>
      <span class="task-popup-span">Edit</span>
    </div>

  </div>

  <div class="d_c_c_c close-popup-todo-settings popup-close-button" onclick="resetMobileTodoSettings()">
  <img class="close-popup-button-todo-settings-img" src="./assets/img/close.svg" alt="" />
</div>

</div>

<div class="d_c_fs_fs width-max" id="mobileTodoSettingsCategoryMenu"> 
<div class="d_c_fs_fs mobile-todo-settings-categories width-max pad-x-40 gap-10" id="mobileTodoSettingsCategories">
</div>
</div>
    `;
}


/**
 * Renders a mobile-friendly category selection option.
 * @param {string} category - The category name to be displayed and interacted with.
 * @returns {string} - HTML markup for a mobile-friendly category selector.
 */
function renderMobileCategories(category) {
    return `<div class="mobile-category-cursor-style cursor-pointer" id="mobileMove${category}" onclick="mobileMoveToCategory(this)">${category}</div>`;
}


/**
 * This function display the result text for "no found" results after using the search feature
 *
 */
function searchResultMessageNoFound() {
    return `<div>there were no results for your search</div> 
            <div>|</div> 
            <div class="search-back-link" onclick="renderAfterSearch()">
                <a class="link-style">go back</a>
            </div>`;
}


/**
 * This function display the result text for "only one found" result after using the search feature
 *
 * @param {string} matchingIndices - array for search matches
 */
function searchResultMessageOneFound(matchingIndices) {
    return `<div>${matchingIndices.length} match found</div> 
            <div>|</div> 
            <div class="search-back-link" onclick="renderAfterSearch()">
                <a class="link-style">go back</a>
            </div>`;
}


/**
 * This function display the result text for "more results as one" after using the search feature
 *
 * @param {string} matchingIndices - array for search matches
 */
function searchResultMessageMoreFound(matchingIndices) {
    return `<div>${matchingIndices.length} matches found</div> 
            <div>|</div> 
            <div class="search-back-link" onclick="renderAfterSearch()">
                <a class="link-style">go back</a>
            </div>`;
}


/////////// END OF RENDERING FOR BOARD ////////////


/**
 * This functions changes the icons in the subtask inputfield 
 * 
 */
function changeIcons() {
    let iconBox = document.getElementById(`dropdownIcon-${templateIndex}`);
    iconBox.classList.remove("input-icon-div");
    iconBox.classList.add("input-icon");
    iconBox.innerHTML = `
      <div class="d_f_c_c gap-5 padding-right-36">
      <div onclick='clearSubtaskInput()' class="icon-edit-delete"> <img src="assets/img/close.svg" alt="cross" /></div>
        <div class='input-spacer'></div>
        <div onclick='addSubtask(),clearSubtaskInput()' class="icon-edit-delete"> <img src="assets/img/check-black.svg" alt="check" /></div>
      </div>
    `;
}


/**
* This function renders the subtasks
*
* @param {string} container - container for the subtasks
*/
function renderSubtasks(container) {
    container.innerHTML = "";
    subtasks.forEach((subtask, index) => {
        container.innerHTML += `
        <div id="subtask${index}" class="d_f_sb_c pad-x-10 subtask width-max">
          <span>• ${subtask}</span>
          <div class='d_f_c_c gap-5'>
            <img src="assets/img/pen_dark.svg" alt="pen" class="subtask-icon" onclick="editSubtask(this)" />
            <div class="subtask-partingline"></div>
            <img src="assets/img/trash_dark.svg" alt="trash" class="subtask-icon" onclick="deleteSubtask(${index})" />
          </div>
        </div>
      `;
    });
}