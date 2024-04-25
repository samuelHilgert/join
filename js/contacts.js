// contacts = Array mit Testkontakten -> diese müssen später noch im Backend angelegt werden
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

/*  SAMUEL TESTING
async function loadExampleContacts() {
    let resp = await fetch('./JSON/contacts.json');
    contacts = await resp.json();
    renderContacts();
}*/

function renderContacts() {
    loadUserContacts();
    //addContactToArray(newContact); // Adding new contact to the contacts array after srting it albhabetically
    sortContacts();
    createUniqueContactId(); // adds a unique ID to very contact in contacts array
    renderContactList();
    setRandomColor();
}

function loadUserContacts() {
    users.forEach(function(user) {
        contacts = contacts.concat(user.contacts);
    });
}

/**
 * This function sets a backgroundcolor for the contacts-circle and checks, if the previous contact-circle has 
 * the same backgroundcolor - in this case, another color is picked. 
 * The function also adds the randomly selected color to the contacts array.
 * 
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
 * This is a function to choose a random color from the "profileCircleColors"-array
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
 * On top of that, the functions also gets the first letter of the surname with the help of split(), parting the names in the array after the blank space 
 * 
 */
function renderContactList() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    let previousFirstLetter = null;
    for (let i = 0; i < contacts.length; i++) {
        const name = contacts[i]['name'];
        const mail = contacts[i]['mail'];
        const phone = contacts[i]['phone'];
        const id = contacts[i]['id'];
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
 * this function combines all elements with the css class "contact-small" in the variable contacts. 
 * Then a loop runs through contacts, where contact is a temporary variable that represents each individual element in the contacts list. 
 * For each individual element in contacts, the two specified css-classes are removed 
 * 
 */
function removeActiveClasslist() {
    let contacts = document.querySelectorAll('.contact-small');
    contacts.forEach(contact => {
        contact.classList.remove('contact-small-active');
        contact.classList.remove('contact-small-active:hover');
    });
}


/**
 * This function first checks whether the ID of the clicked element matches the contactId. 
 * Then, using the destructuring assignment method, the contacts-array is destructured to extract the values 
 * of the properties color, name, mail & phone. 
 * These constants are passed to the renderContactInformationHTML, which returns the HTML code.
 * 
 * 
 * @param {string} contactId - ID of the clicked contact
 * 
 */
function openContactInfo(contactId, removeAnimation = false) { 
    let contact = contacts.find(contact => contact['id'] === contactId);
    if (contact) {
        const { name, mail, phone, color } = contact;
        const firstLetter = name.charAt(0);
        const firstLetterSurname = name.split(' ')[1].charAt(0);
        let contactInfo = document.getElementById('contactInfo');
        let contactInfoHTML = renderContactInformationHTML(color, firstLetter, firstLetterSurname, name, contactId, mail, phone);
        if (removeAnimation) {
            contactInfoHTML = contactInfoHTML.replace('class="animation-in"', '');
        }
        contactInfo.innerHTML = contactInfoHTML;
        removeActiveClasslist();
        let contactElement = document.getElementById(contactId);
        contactElement.classList.add('contact-small-active');
        contactElement.classList.add('contact-small-active:hover');
    }
}


function contactSuccessAnimation() {
    let container = document.getElementById('contactSuccessWrapper');
    container.classList.remove('d-none');
    container.classList.add('animation-in');
    setTimeout(() => {
        container.classList.add('d-none');
    }, 1800);
}


function sortContacts() {
    contacts.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        return nameA.localeCompare(nameB);
    });
}


function addContactToArray() {
    let name = document.getElementById('inputAddContactName').value;
    let mail = document.getElementById('inputAddContactMail').value;
    let phone = document.getElementById('inputAddContactPhone').value;
    let id = (nextId++).toString(); // generates new ID based on the length of the array, without checking the IDs of the existing contacts
    let color = getRandomColor();
    let contact = {
        name: name, 
        mail: mail,
        phone: phone,
        color: color, 
        id: id
    };
    contacts.push(contact);
    sortContacts();
    closeAddContactFormWithoutAnimation();
    renderContactList();
    contactSuccessAnimation();
    openContactInfo(id, true); // true, because function should run without animation
    let contactCircles = document.querySelectorAll('.contact-circle');
    contactCircles.forEach((circle, index) => {
        circle.style.backgroundColor = contacts[index]['color'];
    });
}

// ********* AKTUELL AM IMPLEMENTIEREN - SAMUEL
async function pushContactsOnRemoteServer() {
    // let userIndex = currentUser;            
    users[currentUser].contacts = contacts;
    console.log(users);                             
    await setItem('users', JSON.stringify(users));
}

async function validateAndAddContact(event) {
    event.preventDefault(); // Prevents the default behavior of the form (automatic sending
    let form = document.getElementById('contactForm'); // Validation of the input form data
    if (!form.reportValidity()) { // Checking the validity of the form
        return; // If the form is invalid, the standard error message is displayed
    }
    addContactToArray(); // contacted is added, if form is valid
    await pushContactsOnRemoteServer(); // aktuell am implementieren - Samuel
}


function openAddNewContact() {
    let container = document.getElementById('addContactMask');
    container.innerHTML = renderAddContactContainerHTML();
    let addContactContainer = document.getElementById('addContactContainer');
    addContactContainer.classList.remove('animation-out');
    addContactContainer.classList.add('animation-in');
    container.classList.remove('d-none');
}

function closeAddContactForm() {
    let addContactMask = document.getElementById('addContactMask');
    let addContactContainer = document.getElementById('addContactContainer');
    addContactContainer.classList.add('animation-out');

    // Adds event listener for the animationend event
    addContactContainer.addEventListener('animationend', function animationEndHandler() {
        // Removes the animation-in class and adds the d-none class
        addContactContainer.classList.remove('animation-in');
        addContactMask.classList.add('d-none');

        // Removes event listener to avoid unnecessary use
        addContactContainer.removeEventListener('animationend', animationEndHandler);
    });
}


function closeAddContactFormWithoutAnimation() {
    let addContactMask = document.getElementById('addContactMask');
    addContactMask.classList.add('d-none');
}


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

// Funktion noch um Bearbeitung von Kontakt erweitern
function editContact(contactId) {
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
 * This function gives each contact in the contacts-array a unique id, starting from 1
 * 
 */
function createUniqueContactId() {
    for (let i = 0; i < contacts.length; i++) {
        if (!contacts[i]['id']) {
            contacts[i]['id'] = nextId.toString();
            nextId++;
        }
    }
}


function deleteContact(contactId) {
    let index = contacts.findIndex(contact => contact['id'] === contactId);
    if (index != -1) {
        contacts.splice(index, 1);
        renderContactList();
        let contactCircles = document.querySelectorAll('.contact-circle'); // keeps the backgroundcolor of the circle
        contactCircles.forEach((circle, index) => {
            if (index >= index) { // If the index is greater than or equal to the index of the deleted contact
                circle.style.backgroundColor = contacts[index]['color'];
            }
        });
        let contactInfo = document.getElementById('contactInfo');
        contactInfo.innerHTML = '';
        let wrapper = document.getElementById('editContactMask');
        wrapper.classList.add('d-none');
    }
}