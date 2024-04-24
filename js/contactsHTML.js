function renderLetterAndPartinglineHTML(firstLetter) {
    return `
    <div>
        <div class="contact-letter gap-8">
            <p>${firstLetter}</p>
        </div>
        <div class="parting-line"></div>
    </div>
    `;
}


function renderContactListHTML(id, firstLetter, firstLetterSurname, name, mail) {
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


function renderContactInformationHTML(color, firstLetter, firstLetterSurname, name, contactId, mail, phone) {
    return `
    <div class="animation-in">
        <div class="contact-card-header">
            <div class="circle-big d_f_c_c" style="background-color:${color};">${firstLetter}${firstLetterSurname}</div>
            <div class="contact-card-header-text gap-8">
                <span class="contact-card-header-text-span">${name}</span>
                <div class="d_f_fs_c contact-card-header-icons gap-30">
                    <div class="d_f_c_c gap-8 header-icons-wrapper" onclick="editContact('${contactId}')">
                        <svg class="contact-header-svg" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" />
                        </svg>
                        <span class="contact-header-span">Edit</span>
                    </div>
                    <div class="d_f_c_c gap-8 header-icons-wrapper" onclick="">
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

function renderAddContactContainerHTML() {
    return `
    <div class="add-contact-container" id="addContactContainer">
            <div class="add-contact-container-left">
                <img class="add-contact-img" src="./assets/img/logo2.png" alt="">
                <span class="add-contact-span-big">Add Contact</span>
                <span class="add-contact-span-small">Tasks are better with a team!</span>
                <div class="horizontal-partingline"></div>
            </div>
            <div class="add-contact-container-right">
                <div class="d_f_fe_c close-contact-btn">
                    <div class="add-contact-container-right-img-wrapper d_c_c_c" onclick="closeAddContactForm()">
                        <img class="add-contact-container-right-img" src="./assets/img/close.svg" alt="">
                    </div>
                </div>
                <div class="add-contact-container-right-bottom-wrapper">
                    <div class="add-contact-container-right-bottom">
                        <img class="contact-grey-svg" src="./assets/img/contact-picture.svg" alt="">
                        <form class="contact-form">
                            <input id="inputAddContactName" class="input-style input-name input-font" type="text" placeholder="Name" required>
                            <input id="inputAddContactMail" class="input-style input-email input-font" type="email" placeholder="Email" required>
                            <input id="inputAddContactPhone" class="input-style input-phone input-font" type="text" placeholder="Phone" required>
                            <div class="btn-wrapper">
                                <button class="clear-btn gap-10" onclick="closeAddContactForm()">Cancel
                                    <svg class="contact-header-svg" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 13.4L7.10005 18.3C6.91672 18.4834 6.68338 18.575 6.40005 18.575C6.11672 18.575 5.88338 18.4834 5.70005 18.3C5.51672 18.1167 5.42505 17.8834 5.42505 17.6C5.42505 17.3167 5.51672 17.0834 5.70005 16.9L10.6 12L5.70005 7.10005C5.51672 6.91672 5.42505 6.68338 5.42505 6.40005C5.42505 6.11672 5.51672 5.88338 5.70005 5.70005C5.88338 5.51672 6.11672 5.42505 6.40005 5.42505C6.68338 5.42505 6.91672 5.51672 7.10005 5.70005L12 10.6L16.9 5.70005C17.0834 5.51672 17.3167 5.42505 17.6 5.42505C17.8834 5.42505 18.1167 5.51672 18.3 5.70005C18.4834 5.88338 18.575 6.11672 18.575 6.40005C18.575 6.68338 18.4834 6.91672 18.3 7.10005L13.4 12L18.3 16.9C18.4834 17.0834 18.575 17.3167 18.575 17.6C18.575 17.8834 18.4834 18.1167 18.3 18.3C18.1167 18.4834 17.8834 18.575 17.6 18.575C17.3167 18.575 17.0834 18.4834 16.9 18.3L12 13.4Z" />
                                    </svg>
                                </button>
                                <button type="button" class="btn gap-10" onclick="addContactToArray()">Create Contact<img
                                        src="assets/img/check.png" /></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function renderEditContactHTML(color, firstLetter, firstLetterSurname, name, mail, phone) {
    return `
    <div class="add-contact-container" id="editContactContainer">
            <div class="edit-contact-container-left">
                <img class="edit-contact-img" src="./assets/img/logo2.png" alt="">
                <span class="add-contact-span-big">Edit Contact</span>
                <div class="horizontal-partingline"></div>
            </div>
            <div class="add-contact-container-right">
                <div class="d_f_fe_c close-contact-btn">
                    <div class="add-contact-container-right-img-wrapper d_c_c_c" onclick="closeEditContactForm()">
                        <img class="add-contact-container-right-img" src="./assets/img/close.svg" alt="">
                    </div>
                </div>
                <div class="add-contact-container-right-bottom-wrapper">
                    <div class="add-contact-container-right-bottom">
                        <div class="circle-big d_f_c_c" style="background-color:${color};">${firstLetter}${firstLetterSurname}</div>
                        <form class="contact-form">
                            <input class="input-style input-name input-font placeholder-black" type="text" placeholder="${name}" required>
                            <input class="input-style input-email input-font placeholder-black" type="email" placeholder="${mail}" required>
                            <input class="input-style input-phone input-font placeholder-black" type="text" placeholder="${phone}" required>
                            <div class="btn-wrapper">
                                <button class="clear-btn gap-10" onclick="closeAddContactForm()">Delete</button>
                                <button type="button" class="btn gap-10">Save<img
                                        src="assets/img/check.png" /></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}