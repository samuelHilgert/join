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
    'green',
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


function renderContactInformationHTML() {
    return `
    <div class="contact-card-header">
        <div class="circle-big d_f_c_c">AM</div>
            <div class="contact-card-header-text gap-8">
                Anna Müller
            <div class="d_f_fs_c contact-card-header-icons gap-30">
                <div class="d_f_c_c gap-8 header-icons-wrapper">
                    <svg class="contact-header-svg" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" />
                    </svg>
                    <span class="contact-header-span">Edit</span>
                </div>
                <div class="d_f_c_c gap-8 header-icons-wrapper">
                    <svg class="contact-header-svg" viewBox="0 0 16 18" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M3 18C2.45 18 1.97917 17.8042 1.5875 17.4125C1.19583 17.0208 1 16.55 1 16V3C0.716667 3 0.479167 2.90417 0.2875 2.7125C0.0958333 2.52083 0 2.28333 0 2C0 1.71667 0.0958333 1.47917 0.2875 1.2875C0.479167 1.09583 0.716667 1 1 1H5C5 0.716667 5.09583 0.479167 5.2875 0.2875C5.47917 0.0958333 5.71667 0 6 0H10C10.2833 0 10.5208 0.0958333 10.7125 0.2875C10.9042 0.479167 11 0.716667 11 1H15C15.2833 1 15.5208 1.09583 15.7125 1.2875C15.9042 1.47917 16 1.71667 16 2C16 2.28333 15.9042 2.52083 15.7125 2.7125C15.5208 2.90417 15.2833 3 15 3V16C15 16.55 14.8042 17.0208 14.4125 17.4125C14.0208 17.8042 13.55 18 13 18H3ZM3 3V16H13V3H3ZM5 13C5 13.2833 5.09583 13.5208 5.2875 13.7125C5.47917 13.9042 5.71667 14 6 14C6.28333 14 6.52083 13.9042 6.7125 13.7125C6.90417 13.5208 7 13.2833 7 13V6C7 5.71667 6.90417 5.47917 6.7125 5.2875C6.52083 5.09583 6.28333 5 6 5C5.71667 5 5.47917 5.09583 5.2875 5.2875C5.09583 5.47917 5 5.71667 5 6V13ZM9 13C9 13.2833 9.09583 13.5208 9.2875 13.7125C9.47917 13.9042 9.71667 14 10 14C10.2833 14 10.5208 13.9042 10.7125 13.7125C10.9042 13.5208 11 13.2833 11 13V6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6V13Z" />
                    </svg>
                    <span class="contact-header-span">Delete</span>
                </div>
            </div>
        </div>
    </div>
    <span class="contact-name pad-y-20">Contact Information</span>
    <div class="mail-phone-wrapper gap-22">
        <div class="gap-15 mail-phone-wrapper">
            <span class="span-thick">Email</span>
            <span class="contact-mail">anna.mueller@strive.com</span>
        </div>
        <div class="gap-15 mail-phone-wrapper">
            <span class="span-thick">Phone</span>
            <span>+43 789 878 566</span>
        </div>
    </div>
    `;
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
 * This function opens the detailed contact information by clicking on a contact in the contact list 
 * and adds two css-classes to the clicked element.
 * Before doing so, the removeActiveClasslist function is executed.
 * 
 * @param {string} contactId - ID of the clicked contact
 * 
 */
function openContactInfo(contactId) {
    removeActiveClasslist();
    let contact = document.getElementById(contactId);
    contact.classList.add('contact-small-active');
    contact.classList.add('contact-small-active:hover');
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

