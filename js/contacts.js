let contacts = [];

let profileCircleColors = [
    'teal',
    'lightseagreen',
    'purple',
    'slategrey',
    'crimson',
    'orange',
    'navy',
    'indigo',
    'fuchsia',
    'skyblue',
    'forestgreen',
    'tan',
    'darkgreen',
    'blue',
    'indianred',
    'seagreen',
    'lightsteelblue',
    'cadetblue'
];

let nextId = 1;

/**
 * This function renders the contact page.
 */
function renderContacts() {
    sortContacts();
    createUniqueContactId();
    renderContactList();
    setRandomColor();
}


/**
 * This is a function that checks whether a guest or user has logged in
 * The data is only saved remotely if the user is logged in
 * In both cases sample contacts are also loaded
 * 
 */
async function updateContacts() {
    if (loggedAsGuest === true) {
        await loadExampleContacts();
    } else {
        let currentUserContacts = users[currentUser].contacts;
        if (currentUserContacts.length === 0) {
            await loadExampleContacts();
            await pushContactsOnRemoteServer();
        }
        else {
            contacts = users[currentUser].contacts;
        }
    }
}

/**
 * This is a function which includes the sample contacts from the contacts.json JSON-Document 
 * 
 */
async function loadExampleContacts() {
    let resp = await fetch('./JSON/contacts.json');
    contacts = await resp.json();
}


/**
 * This function sets a backgroundcolor for the contacts-circle and checks, if the previous contact-circle has 
 * the same backgroundcolor - in this case, another color is picked. 
 * The function also adds the randomly selected color to the contacts array.
 */
function setRandomColor() {
    let lastColor = null;
    let contactCircles = document.querySelectorAll('.contact-circle');
    contactCircles.forEach((circle, index) => {
        let randomColor;
        do {
            randomColor = getRandomColor();
        } while (randomColor === lastColor); // Schleife, bis eine neue Farbe gefunden wird
        circle.style.backgroundColor = randomColor;
        lastColor = randomColor;
        contacts[index]['color'] = randomColor;
    });
}


/**
 * This is a function to choose a random color from the "profileCircleColors"-array.
 * 
 * @returns - returns a randomly selected background color from the array
 */
function getRandomColor() {
    let randomColor = Math.floor(Math.random() * profileCircleColors.length);
    return profileCircleColors[randomColor];
}


/**
 * This function renders the contact list - therefore it iterates trough the contacts-array and checks, 
 * if there is more than one name with the same first letter.
 * In this case, the renderLetterAndPartingLine function is just rendered once for every first letter and not for every single contact.
 * On top of that, the function also gets the first letter of the surname with the help of split(), parting the names in the array after the blank space.
 */
function renderContactList() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    let previousFirstLetter = null;
    for (let i = 0; i < contacts.length; i++) {
        const { name, mail, id } = contacts[i];
        const firstLetter = name.charAt(0);
        const firstLetterSurname = name.split(' ')[1].charAt(0);
        if (firstLetter !== previousFirstLetter) {
            contactList.innerHTML += renderLetterAndPartinglineHTML(firstLetter);
            previousFirstLetter = firstLetter;
        }
        contactList.innerHTML += renderContactListHTML(id, firstLetter, firstLetterSurname, name, mail);
    }
}


/**
 * This function combines all elements with the css class "contact-small" in the variable contacts. 
 * Then a loop runs through contacts, where contact is a temporary variable that represents each individual element in the contacts list. 
 * For each individual element in contacts, the two specified css-classes are removed 
 */
function removeActiveClasslist() {
    let contacts = document.querySelectorAll('.contact-small');
    contacts.forEach(contact => {
        contact.classList.remove('contact-small-active');
        contact.classList.remove('contact-small-active:hover');
    });
}


/**
 * This function renders the contact information HTML based on the provided contact data.
 * 
 * @param {object} contact - the contact object contains name, mail, phone and color of the currently clicked contact
 * @param {string} contactId - the ID of the currently clicked contact
 * @param {boolean} removeAnimation - flag indicating whether to remove animation from the HTML
 * @returns {string} - the HTML string displaying the contact information
 * 
 */
function renderContactInfo(contact, contactId, removeAnimation) {
    const { name, mail, phone, color } = contact;
    const firstLetter = name.charAt(0);
    const firstLetterSurname = name.split(' ')[1].charAt(0);
    let contactInfoHTML = renderContactInformationHTML(color, firstLetter, firstLetterSurname, name, contactId, mail, phone);
    if (removeAnimation) {
        contactInfoHTML = contactInfoHTML.replace('class="animation-in"', '');
    }
    return contactInfoHTML;
}


/**
 * This function updates the contact information in the DOM with the provided HTML.
 * 
 * @param {string} contactId - the ID of the currently clicked contact
 * @param {string} contactInfoHTML - the HTML string displaying the contact information
 * 
 */
function updateContactInfo(contactId, contactInfoHTML) {
    let contactInfo = document.getElementById('contactInfo');
    contactInfo.innerHTML = contactInfoHTML;
}


/**
 * This function opens the contact information for the currently clicked contact. 
 * It first searches for the contact in the contacts list using its ID. When the contact is found, 
 * the renderContactInfo function is called to generate the HTML for the contact information, specifying 
 * the removeAnimation option to control whether animations should be removed. Then the updateContactInfo 
 * function is called to update the contact information in the DOM. After doing so, the function removes 
 * all active CSS-classes from the contact list elements and then adds 'contact-small-active' class to
 * visually highlight the displayed contact. If required, the 'contact-small-active:hover' class is also added.
 * 
 * @param {string} contactId - the ID of the currently clicked contact
 * @param {boolean} removeAnimation - flag indicating whether to remove animation from the HTML
 */
function openContactInfo(contactId, removeAnimation = false) {
    let contact = contacts.find(contact => contact['id'] === contactId);
    if (contact) {
        let contactInfoHTML = renderContactInfo(contact, contactId, removeAnimation);
        updateContactInfo(contactId, contactInfoHTML);
        removeActiveClasslist();
        let contactElement = document.getElementById(contactId);
        contactElement.classList.add('contact-small-active');
        contactElement.classList.add('contact-small-active:hover');
    }
}


/**
 * This function starts an temporarily limited animation by removing 'd-none' & adding 'animation-in' 
 * CSS-classes to the container.
 * 
 */
function contactSuccessAnimation() {
    let container = document.getElementById('contactSuccessWrapper');
    container.classList.remove('d-none');
    container.classList.add('animation-in');
    setTimeout(() => {
        container.classList.add('d-none');
    }, 1800);
}


/**
 * This function sorts the contacts array alphabetically by the name property.
 * 
 */
function sortContacts() {
    contacts.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
    });
}


/**
 * This function gets the next available ID that's not already used in the contacts array. 
 * 
 * @returns {string} - the next available ID
 */
function getNextAvailableId() {
    let id = 1;
    while (contacts.some(contact => contact.id === id.toString())) {
        id++;
    }
    return id.toString();
}


/**
 * 
 * This function gets the input values for the new contact.
 * 
 * @returns {object} - an object containing the input values for the new contact
 */
function getNewContactInput() {
    let name = document.getElementById('inputAddContactName').value;
    let mail = document.getElementById('inputAddContactMail').value;
    let phone = document.getElementById('inputAddContactPhone').value;
    let id = getNextAvailableId();
    let color = getRandomColor();
    return {
        name: name,
        mail: mail,
        phone: phone,
        color: color,
        id: id
    };
}


/**
 * This function adds a newly created contact to the contacts array and performs necessary actions.
 */
function addNewContactToArray() {
    let newContact = getNewContactInput();
    contacts.push(newContact);
    sortContacts();
    closeAddContactFormWithoutAnimation();
    renderContactList();
    contactSuccessAnimation();
    openContactInfo(newContact['id'], true); // true, because function should run without animation
    keepCircleBackgroundcolor();
}



async function pushContactsOnRemoteServer() {
    users[currentUser].contacts = contacts;
    await setItem('users', JSON.stringify(users));
}


/**
 * This function validates the input data of the contact form, adds a new contact to the array, 
 * and pushes the updated contacts to the remote server.
 * 
 * @param {event} event - the event object representing the form submission event
 * @returns {promise<void>} - a promise that resolves once the new contact has been added to the remote server
 */
async function validateAndAddContact(event) {
    event.preventDefault(); // Prevents the default behavior of the form (automatic sending
    let form = document.getElementById('contactForm'); // Validation of the input form data
    if (!form.reportValidity()) { // Checking the validity of the form
        return; // If the form is invalid, the standard error message is displayed
    }
    addNewContactToArray(); // contacted is added, if form is valid
    if (!loggedAsGuest === true || loggedAsGuest === false) {
        await pushContactsOnRemoteServer();
    } else {
        let div = document.getElementById('guestMessagePopupContacts');
        let messageText = document.getElementById('guestMessageContacts');
        showGuestPopupMessage(div, messageText);
    }
}

/**
 * This function opens the form for adding a new contact.
 */
function openAddContactForm() {
    let container = document.getElementById('addContactMask');
    container.innerHTML = renderAddContactContainerHTML();
    let addContactContainer = document.getElementById('addContactContainer');
    addContactContainer.classList.remove('animation-out');
    addContactContainer.classList.add('animation-in');
    container.classList.remove('d-none');
}


/**
 * This function closes the form for adding a new contact.
 */
function closeAddContactForm() {
    let addContactMask = document.getElementById('addContactMask');
    let addContactContainer = document.getElementById('addContactContainer');
    addContactContainer.classList.add('animation-out');
    addContactContainer.addEventListener('animationend', function animationEndHandler() {
        addContactContainer.classList.remove('animation-in');
        addContactMask.classList.add('d-none');
        addContactContainer.removeEventListener('animationend', animationEndHandler);
    });
}


/**
 * This function closes the form for adding a new contact without the closing animation.
 */
function closeAddContactFormWithoutAnimation() {
    let addContactMask = document.getElementById('addContactMask');
    addContactMask.classList.add('d-none');
}


/**
 * This function closes the edit contact form by adding an 'animation-out' class to the container. 
 */
function closeEditContactForm() {
    let editContactMask = document.getElementById('editContactMask');
    let editContactContainer = document.getElementById('editContactContainer');
    editContactContainer.classList.add('animation-out');
    editContactContainer.addEventListener('animationend', function animationEndHandler() {
        editContactContainer.classList.remove('animation-in');
        editContactMask.classList.add('d-none');
        editContactContainer.removeEventListener('animationend', animationEndHandler);
    });
}


/**
 * This function opens the edit contact form for the specified contact ID.
 * 
 * @param {string} contactId - the ID of the currently clicked contact
 */
function openEditContactForm(contactId) {
    let contact = contacts.find(contact => contact['id'] === contactId);
    if (contact) {
        const { name, mail, phone, color } = contact;
        const firstLetter = name.charAt(0);
        const firstLetterSurname = name.split(' ')[1].charAt(0);
        let wrapper = document.getElementById('editContactMask');
        wrapper.innerHTML = renderEditContactHTML(color, firstLetter, firstLetterSurname, name, mail, phone, contactId);
        let editContactContainer = document.getElementById('editContactContainer');
        wrapper.classList.remove('d-none');
        editContactContainer.classList.remove('animation-out');
        editContactContainer.classList.add('animation-in');
    }
}


/**
 * This function updates the contact information in the contacts array and performs necessary actions.
 * 
 * @param {string} contactId - the ID of the contact to edit
 * @param {string} newName - the new name of the contact
 * @param {string} newMail - the new email of the contact
 * @param {string} newPhone - the new phone number of the contact
 */
async function updateContactInformation(contactId, newName, newMail, newPhone) {
    let index = contacts.findIndex(contact => contact['id'] === contactId);
    if (index !== -1) {
        contacts[index]['name'] = newName;
        contacts[index]['mail'] = newMail;
        contacts[index]['phone'] = newPhone;
        if (!loggedAsGuest === true || loggedAsGuest === false) {
            await pushContactsOnRemoteServer();
        } else {
            let div = document.getElementById('guestMessagePopupContacts');
            let messageText = document.getElementById('guestMessageContacts');
            showGuestPopupMessage(div, messageText);
        }
        renderContactList();
    }
}

/**
 * This functions edits a contact with the specified ID using the new information provided.
 * 
 * @param {string} contactId - the ID of the contact to edit
 */
async function editContact(contactId) {
    let newName = document.getElementById('newName').value;
    let newMail = document.getElementById('newMail').value;
    let newPhone = document.getElementById('newPhone').value;
    await updateContactInformation(contactId, newName, newMail, newPhone);
    closeEditContactForm();
    keepCircleBackgroundcolor();
    openContactInfo(contactId, true);
}


/**
 * This function gives each contact in the contacts-array a unique id, starting from 1.
 */
function createUniqueContactId() {
    for (let i = 0; i < contacts.length; i++) {
        if (!contacts[i]['id']) {
            contacts[i]['id'] = nextId.toString();
            nextId++;
        }
    }
}


/**
 * This function keeps the background color of contact circles consistent with the color 
 * stored in the contacts array.
 */
function keepCircleBackgroundcolor() {
    let contactCircles = document.querySelectorAll('.contact-circle');
    contactCircles.forEach((circle, index) => {
        circle.style.backgroundColor = contacts[index]['color'];
    });
}


/**
 * This function clears the contact info and hides the mask.
 */
function clearContactInfoAndHideMask() {
    let contactInfo = document.getElementById('contactInfo');
    contactInfo.innerHTML = '';
    let wrapper = document.getElementById('editContactMask');
    wrapper.classList.add('d-none');
}


/**
 * This function deletes a contact from the contacts array and performs necessary actions.
 * 
 * @param {string} contactId - the ID of the contact to delete
 */
async function deleteContact(contactId) {
    let index = contacts.findIndex(contact => contact['id'] === contactId);
    if (index != -1) {
        contacts.splice(index, 1);
        if (!loggedAsGuest === true || loggedAsGuest === false) {
            await pushContactsOnRemoteServer();
        }
        else {
            let div = document.getElementById('guestMessagePopupContacts');
            let messageText = document.getElementById('guestMessageContacts');
            showGuestPopupMessage(div, messageText);
        }
        renderContactList();
        keepCircleBackgroundcolor();
        clearContactInfoAndHideMask();
    }
}
