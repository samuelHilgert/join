// contacts = Array mit Testkontakten -> diese müssen später noch im Backend angelegt werden
let contacts = [
    {
        name: "Anna Müller",
        mail: "anna.mueller@strive.com",
        phone: "+43 789 878 566",
        color: ""
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
        color: ""
    },
    {
        name: "Frank Groß",
        mail: "groß@frank.de",
        phone: "+49 668463546",
        color: ""
    },
    {
        name: "James Walker",
        mail: "jw@dreamlogistics.com",
        phone: "+49 64865155",
        color: ""
    },
    {
        name: "Leonie Maier",
        mail: "leonie.maier@abc-construct.com",
        phone: "+49 596 487 12",
        color: ""
    },
    {
        name: "Max Baumgart",
        mail: "max@baumgart.de",
        phone: "+49 12 123 456",
        color: ""
    },
    {
        name: "Olivia Shaun",
        mail: "os@health-co.com",
        phone: "+25 1648689446",
        color: ""
    },
    {
        name: "Paul Lee",
        mail: "lee@lee-enterprises.com",
        phone: "+97 947621654",
        color: ""
    },
    {
        name: "Volker Richter",
        mail: "richter@cv-systems.com",
        phone: "+63 349 555 479",
        color: ""
    }
];

let profileCircleColors = [
    'teal',
    'lightseagreen',
    'violet',
    'slategrey',
    'crimson',
    'orange',
    'navy',
    'indigo',
    'lightpink',
    'skyblue',
    'forestgreen',
    'tan',
    'green'
];

let lastColor = null;


/**
 * This function sets a backgroundcolor for the contacts-circle and checks, if the previous contact-circle has the same backgroundcolor - in this case, another color is picked
 * 
 */
function setRandomColor() {
    let contactCircles = document.querySelectorAll('.contact-circle');
    contactCircles.forEach(circle => {
        let randomColor;
        do {
            randomColor = getRandomColor();
        } while (randomColor === lastColor); // Schleife, bis eine neue Farbe gefunden wird
        circle.style.backgroundColor = randomColor;
        lastColor = randomColor; 
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
 * This function opens the detailed contact information by clicking on a contact in the contact list
 * 
 */
function openContactInfo() {
    let contact = document.getElementById('testID');
    contact.classList.add('contact-small-active');
    contact.classList.add('contact-small-active:hover');
    // classlists need to be removed again when clicking on another contact
}


function renderContactList() {
    let contactList = document.getElementById('contactList');
    contactList.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        const name = contacts[i]['name'];
        const mail = contacts[i]['mail'];
        contactList.innerHTML += renderContactListHTML(name, mail);
    }
}


function renderContactListHTML(name, mail) {
    return `<div class="contact-small" id="" onclick="openContactInfo()">
    <div class="contact-circle d_f_c_c">
        <div class="contact-circle-letters">AM</div>
    </div>
    <div class="contact-name-mail">
        <div class="contact-name">${name}</div>
        <div class="contact-mail">${mail}</div>
    </div>
</div>`;
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

// CONTACT EXAMPLE FOR TESTING THE addContactToArray FUNCTION
const newContact = {
    name: "Xen Johnson",
    mail: "xen.johnson@example.com",
    phone: "+1234567890",
    color: ""
};


// CONSOLE LOG FOR TESTING THE addContactToArray FUNCTION
console.log(contacts);
