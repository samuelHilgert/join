// contacts = Array mit Testkontakten -> diese müssen später noch im Backend angelegt werden
let contacts = [
    {
        name: "Anna Müller",
        mail: "anna.mueller@strive.com",
        phone: "+43 789 878 566",
        color: "",
        id: ""
    },
    {
        name: "Bernd Hofmann",
        mail: "hofmann@ib-bank.com",
        phone: "+49 647 289 145",
        color: ""
    },
    {
        name: "Eva Grace",
        mail: "eg@marinaclub.com",
        phone: "+25 493448951",
        color: "",
        id: ""
    },
    {
        name: "Frank Groß",
        mail: "groß@frank.de",
        phone: "+49 668463546",
        color: "",
        id: ""
    },
    {
        name: "James Walker",
        mail: "jw@dreamlogistics.com",
        phone: "+49 64865155",
        color: "",
        id: ""
    },
    {
        name: "Alex Maier",
        mail: "alex.maier@strive.com",
        phone: "+43 789 878 787",
        color: "",
        id: ""
    },
    {
        name: "Leonie Maier",
        mail: "leonie.maier@abc-construct.com",
        phone: "+49 596 487 12",
        color: "",
        id: ""
    },
    {
        name: "Max Baumgart",
        mail: "max@baumgart.de",
        phone: "+49 12 123 456",
        color: "",
        id: ""
    },
    {
        name: "Olivia Shaun",
        mail: "os@health-co.com",
        phone: "+25 1648689446",
        color: "",
        id: ""
    },
    {
        name: "Paul Lee",
        mail: "lee@lee-enterprises.com",
        phone: "+97 947621654",
        color: "",
        id: ""
    },
    {
        name: "Volker Richter",
        mail: "richter@cv-systems.com",
        phone: "+63 349 555 479",
        color: "",
        id: ""
    }
];

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


function renderContacts() {
    addContactToArray(newContact); // Adding new contact to the contacts array after srting it albhabetically
    createUniqueContactId(); // adds a unique ID to very contact in contacts array
    renderContactList();
    setRandomColor();
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
function openContactInfo(contactId) {
    let contact = contacts.find(contact => contact['id'] === contactId)
    if (contact) {
        const { name, mail, phone, color } = contact;
        const firstLetter = name.charAt(0);
        const firstLetterSurname = name.split(' ')[1].charAt(0);
        let contactInfo = document.getElementById('contactInfo');
        contactInfo.innerHTML = renderContactInformationHTML(color, firstLetter, firstLetterSurname, name, mail, phone);
        removeActiveClasslist();
        let contactElement = document.getElementById(contactId);
        contactElement.classList.add('contact-small-active');
        contactElement.classList.add('contact-small-active:hover');
    }
}


/**
 * This function adds new contacts to the contacts-array after sorting them in alphabetical order by using sort & localeCompare
 * 
 * @param {string} contact - function-internal placeholder for the contact to be added to the function
 */
function addContactToArray(contact) {
    contacts.push(contact);
    contacts.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        return nameA.localeCompare(nameB);
    });
}


function addNewContact() {
    let addContactContainer = document.getElementById('addContactContainer');
    let container = document.getElementById('addContactMask');
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

// CONTACT EXAMPLE FOR TESTING THE addContactToArray FUNCTION
const newContact = {
    name: "Xaver Johnson",
    mail: "x.johnson@example.com",
    phone: "+1234567890",
    color: "",
    id: ""
};

