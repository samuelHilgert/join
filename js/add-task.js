let newTask = [];
// let dropdownContact = [];  Nicht mehr notwendig
let subtasks = [];
let contactsForTasks = [];
let checkedCheckboxes = [];   // Array zur Speicherung der ausgewählten Checkboxen im Dropdown Menü

/**
 * This function gets the next available ID that's not already used in the tasks array. 
 * 
 * @returns {string} - the next available ID
 */
function getNextAvailableTaskId() {
  let id = 1;
  while (tasks.some(task => task.id === id.toString())) {
      id++;
  }
  return id.toString();
}

// function to add the task
async function addTask() {
  const taskInput = readTaskInput();
  const prio = determinePriority();
  let id = getNextAvailableTaskId();
  const task = {
    id: id,
    label: taskInput.category,
    title: taskInput.title,
    description: taskInput.description,
    dueDate: new Date(taskInput.date).getTime(),
    assignedTo: checkedCheckboxes,
    priority: prio,
    subtasks: subtasks,
    category: 'backlog',
  };
  newTask.push(task);
  // dropdownContact = []; nicht mehr notwendig
  if (loggedAsGuest === true) {
    let div = document.getElementById('guestMessagePopupAddTask');
    let messageText = document.getElementById('guestMessageAddTask');
    resetAddTaskValues();
    showGuestPopupMessage(div, messageText);
  } else {
    users[currentUser].tasks.push(...newTask);
    await setItem('users', JSON.stringify(users));
    resetAddTaskValues();
    alert('Neue Aufgabe erstellt!');
  }
}

function resetAddTaskValues() {
  document.getElementById("task-title").value = '';
  document.getElementById("task-description").value = '';
  document.getElementById("task-date").value = '';
  document.getElementById("task-category").value = '';
  document.getElementById("subtask").value = '';
  document.getElementById("contactSelection").innerHTML = '';
  newTask = []
  subtasks = [];
  checkedCheckboxes = []; // zum Zurücksetzen von den ausgewählten Kontakten im Dropdown Menü
}

//get informations from input
function readTaskInput() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const date = document.getElementById("task-date").value;
  const category = document.getElementById("task-category").value;
  const subtask = document.getElementById("subtask").value;
  return {
    title: title,
    description: description,
    date: date,
    category: category,
  };
}

async function updateTaskContacts() {
  if (loggedAsGuest === true) {
    let resp = await fetch('./JSON/contacts.json');
    contactsForTasks = await resp.json();
  } else {
    let currentUserContactsForTasks = users[currentUser].contacts;
    contactsForTasks = currentUserContactsForTasks;
  }
}

function openDropdown() {
  let taskContactDiv = document.getElementById('taskContactDiv');
  if (taskContactDiv.style.display === 'flex') {
    taskContactDiv.style.display = 'none';
  } else {
    taskContactDiv.style.display = 'flex';
    checkedCheckboxes = [];
    for (let index = 0; index < contactsForTasks.length; index++) {
      const contact = contactsForTasks[index];
      renderContactsDropwdown(contact, index);
    }
  }
  // contactsByCheckbox(); wird nicht mehr benötigt
  showContactSelection();
}

function renderContactsDropwdown(contact, index) {
  let letters = contactNamesLetters(contact.name);
  renderDopdownMenu(taskContactDiv, letters, contact, index);
}

function contactNamesLetters(contact) {
  let letters;
  let firstLetter = contact.charAt(0); // Erster Buchstabe des Vornamens
  let spaceIndex = contact.indexOf(' '); // Index des Leerzeichens zwischen Vor- und Nachnamen
  let secondLetter = ''; // Initialisieren Sie den zweiten Buchstaben
  if (spaceIndex !== -1 && spaceIndex < contact.length - 1) {
    secondLetter = contact.charAt(spaceIndex + 1); // Zweiter Buchstabe des Nachnamens
  }
  letters = firstLetter + secondLetter;
  return letters;
}

function getBackgroundColorAssignedContact(contactIndex) {
  return contacts[contactIndex].color;
}

function handleCheckboxChange(index) {
  let wrapper = document.getElementById(`wrapper${index}`);
  let checkbox = document.getElementById(`checkbox${index}`);
  let contactName = document.getElementById(`contactName${index}`)
  if (checkbox.checked) {
    wrapper.style.backgroundColor = 'rgba(42, 54, 71, 1)';
    contactName.style.color = 'rgba(255, 255, 255, 1)';
    console.log('ausgewählter Kontakt', contactName.textContent);
    checkedCheckboxes.push(contactName.textContent);
  } else {
    wrapper.style.backgroundColor = '';
    contactName.style.color = 'rgba(0, 0, 0, 1)';
    let indexToRemove = checkedCheckboxes.indexOf(contactName.textContent);
    if (indexToRemove !== -1) {
      checkedCheckboxes.splice(indexToRemove, 1);
    }
  }
}

function renderDopdownMenu(taskContactDiv, letters, contact, index) {
  let backgroundColor = getBackgroundColorAssignedContact(index);
  taskContactDiv.innerHTML += `
  <div class="d_f_sb_c width-max dropdown-contact-wrapper" id="wrapper${index}">
    <div class="d_f_fs_c gap-20 dropdown-contact">
      <div class="d_f_c_c contact-circle-small contact-circle-small-letters" id="contactLetters${index}" style="background-color: ${backgroundColor};">${letters}</div> 
      <div class="d_f_fs_c" id="contactName${index}">${contact.name}</div> 
    </div>
    <div class="d_f_fe_c"> 
      <input type="checkbox" id="checkbox${index}" name="checkbox${index}" value="${contact.name}" onchange="handleCheckboxChange(${index})">
    </div>
  </div>
  `;
}

// Funktion wird nicht mehr benötigt
//function contactsByCheckbox(index) {
//  let checkboxes = document.querySelectorAll('input[type="checkbox"]');   // Alle Checkboxen abfragen
//  checkboxes.forEach(function (checkbox) {   // Für jede Checkbox überprüfen, ob sie angeklickt wurde
//    if (checkbox.checked) {   // Wenn die Checkbox angeklickt wurde, füge ihren Wert dem Array hinzu
//      checkedCheckboxes.push(checkbox.value);
//    }
//  });
//}

function showContactSelection() {
  let contactSelection = document.getElementById('contactSelection');
  contactSelection.innerHTML = ``;
  for (let index = 0; index < checkedCheckboxes.length; index++) {
    const contact = checkedCheckboxes[index];
    const letters = contactNamesLetters(contact);
    contactSelection.innerHTML += `<div class="d_f_c_c">${letters}</div>`;
  }
}

//Change Prio Btn colors!
function setPriority(btnId) {
  removeActiveClasses();
  setActiveClasses(btnId);
}

//Return Value from Priority!
function determinePriority() {
  let prio = "medium"; // Standardpriorität
  const urgentBtn = document.getElementById("urgent-btn");
  const mediumBtn = document.getElementById("medium-btn");
  const lowBtn = document.getElementById("low-btn");
  if (urgentBtn.classList.contains("active-prio-btn-urgent")) {
    prio = "urgent";
  } else if (lowBtn.classList.contains("active-prio-btn-low")) {
    prio = "low";
  }
  return prio;
}

function setActiveClasses(btnId) {
  const clickedButton = document.getElementById(btnId);
  const buttonSVG = clickedButton.querySelector("svg");
  switch (btnId) {
    case "urgent-btn":
      clickedButton.classList.add("active-prio-btn-urgent");
      buttonSVG.style.fill = 'white';
      break;
    case "medium-btn":
      clickedButton.classList.add("active-prio-btn-medium");
      buttonSVG.style.fill = 'white';
      break;
    case "low-btn":
      clickedButton.classList.add("active-prio-btn-low");
      buttonSVG.style.fill = 'white';
      break;
    default:
      break;
  }
}

function removeActiveClasses() {
  const buttons = ["urgent-btn", "medium-btn", "low-btn"];
  buttons.forEach((button) => {
    const buttonElement = document.getElementById(button);
    buttonElement.classList.remove(
      "active-prio-btn-urgent",
      "active-prio-btn-medium",
      "active-prio-btn-low"
    );
    buttonElement.querySelector("svg").style.fill = '';
  });
}

// for category section
function chooseCategory(category) {
  document.getElementById("task-category").value = category.innerText;
}

function toggleCategoryDiv() {
  var categoryDiv = document.getElementById("category-div");
  var dropdownIcon = document.getElementById("category-drop-icon");
  if (
    categoryDiv.style.display === "none" ||
    categoryDiv.style.display === ""
  ) {
    categoryDiv.style.display = "flex";
    dropdownIcon.style.transform = "rotate(180deg)";
  } else {
    categoryDiv.style.display = "none";
    dropdownIcon.style.transform = "";
  }
}

//for subtasks section
function addSubtask() {
  const subtaskInput = document.getElementById("subtask");
  const subtaskValue = subtaskInput.value.trim();
  if (subtaskValue !== "") {
    const subtaskContainer = document.getElementById("subtask-div");
    subtasks.push(subtaskValue);
    renderSubtasks(subtaskContainer);
    subtaskInput.value = "";
    changeIcons();
  }
}

function getSubtaskIndex(element) {
  const subtaskContainer = document.getElementById("subtask-div");
  const subtaskIndex = Array.from(subtaskContainer.children).indexOf(
    element.parentNode.parentNode
  );
  return subtaskIndex;
}

function renderSubtasks(container) {
  container.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    container.innerHTML += `
      <div id='subtask${index}' class='d_f_sb_c pad-x-10'>
        <span>● ${subtask}</span>
        <div class='d_f_c_c gap-5'>
          <img src="assets/img/pen_dark.svg" alt="pen" class='cursor-pointer' onclick="editSubtask(this)" />
          <img src="assets/img/trash_dark.svg" alt="trash" class='cursor-pointer' onclick="deleteSubtask(${index})" />
        </div>
      </div>
    `;
  });
}

function changeIcons() {
  let iconBox = document.getElementById("dropdown-icon");
  iconBox.classList.remove("input-icon-div");
  iconBox.classList.add("input-icon");

  iconBox.innerHTML = `
    <div class="d_f_c_c gap-5 padding-right-36">
    <div onclick='clearSubtaskInput()' class="icon-edit-delete"> <img src="assets/img/input-cross.png" alt="cross" /></div>
      <div class='input-spacer'></div>
      <div onclick='addSubtask(),clearSubtaskInput()' class="icon-edit-delete"> <img style='height: 17px;' src="assets/img/input-check.png" alt="check" /></div>
    </div>
  `;
}

function editSubtask(element) {
  const subtaskContainer = document.getElementById("subtask-div");
  const subtaskIndex = getSubtaskIndex(element);
  if (subtaskIndex !== -1) {
    const subtaskInput = document.getElementById("subtask");
    subtaskInput.value = subtasks[subtaskIndex];
    subtasks.splice(subtaskIndex, 1);
    renderSubtasks(subtaskContainer);
  }
  changeIcons();
}

function deleteSubtask(i) {
  subtasks.splice(i, 1);
  document.getElementById(`subtask${i}`).remove();
}

function clearSubtaskInput() {
  let subtaskInput = document.getElementById("subtask");
  subtaskInput.value = "";
  subtaskInput.blur();
  let iconBox = document.getElementById("dropdown-icon");
  iconBox.innerHTML = `
   <div onclick="changeIcons()" class='icon-edit-delete'><img src="assets/img/input-plus.png" alt="plus" /></div>
  `;
}

//clear the hole form
function clearForm() {
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("task-date").value = "";
  document.getElementById("task-category").value = "";
  document.getElementById("subtask").value = "";
  document.getElementById("task-assignedTo").value = "";
  document.getElementById("subtask-div").innerHTML = "";
  document.getElementById("dropdown-div").style.display = "none";
  dropdownContact = [];
  subtasks = [];
  setPriority("medium-btn");
}

function rotateDropdownIcon(icon, isOpen) {
  if (isOpen) {
    icon.style.transform = "rotate(180deg)";
  } else {
    icon.style.transform = "";
  }
}

function setMinimumDate() {
  var currentDate = new Date();
  var minDate = currentDate.toISOString().split("T")[0];
  document.getElementById("task-date").setAttribute("min", minDate);
}



//Funktion wird ab jetzt nicht mehr aufgerufen!
  /*  
//for the contacts at Assigned to section
function openDropdownContacts() {
  console.log('Alle Kontakte:', contactsForTasks);
  let Dropdownmenu = document.getElementById("inputfield-dropdown");
  let dropdownArrow = document.getElementById("dropdown-arrow");
  let dropdownDiv = document.getElementById("task-contact-div");
  dropdownDiv.style.display =
    dropdownDiv.style.display === "flex" ? "none" : "flex";
  rotateDropdownIcon(dropdownArrow, dropdownDiv.style.display === "flex");

  // Leere den HTML-Inhalt des dropdownDiv-Elements
  dropdownDiv.innerHTML = '';

  // Füge die Kontakte hinzu

  for (let i = 0; i < contactsForTasks.length; i++) {
    const contact = contactsForTasks[i];
    console.log('Kontakt', i, ':', contact); // Debugging-Ausgabe
    dropdownDiv.innerHTML += `
    <div class="parting-line-dropdown"></div>
    <div class="task-contact" id='test${i}'onclick='chooseContact(${i},"${contact.name}")' >
      <div class="contact-circle d_f_c_c">
        <div class="contact-circle-letters">AM</div>
      </div>
      <div class="contact-name-mail">
        <div class="contact-name">${contact.name}</div>
      </div>
    </div>
    `;
  }
}*/

//TEST// //Funktion wird ab jetzt nicht mehr aufgerufen!
/* 
async function testOpenDropdown() {
  await updateTaskContacts();
  console.log('Alle Kontakte:', contactsForTasks);
  let dropdownDiv = document.getElementById("task-contact-div");
  dropdownDiv.innerHTML = '';
  for (let i = 0; i < contactsForTasks.length; i++) {
    const contact = contactsForTasks[i];
    console.log('Kontakt', i, ':', contact); // Debugging-Ausgabe
    dropdownDiv.innerHTML += `
    <div class="parting-line-dropdown"></div>
    <div class="task-contact" id='test${i}'onclick='chooseContact(${i},"${contact.name}")' >
      <div class="contact-circle d_f_c_c">
        <div class="contact-circle-letters">AM</div>
      </div>
      <div class="contact-name-mail">
        <div class="contact-name">${contact.name}</div>
      </div>
    </div>
    `;
  }
} 

function chooseContact(i, name) {
  constElement = document.getElementById(`test${i}`);
  constElement.style.backgroundColor = "red";
  dropdownContact.push(name);
}


//TEST ENDE//

*/





