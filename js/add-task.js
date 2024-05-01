let newTask = [];
// let dropdownContact = [];  Nicht mehr notwendig
let subtasks = [];
let contactsForTasks = [];
let matchingContactNames = [];
let checkedCheckboxes = []; // Array zur Speicherung der ausgewählten Checkboxen im Dropdown Menü
let contactsLoaded = false;

/**
 * This function gets the next available ID that's not already used in the tasks array.
 *
 * @returns {string} - the next available ID
 */
function getNextAvailableTaskId() {
  let id = 1;
  while (tasks.some((task) => task.id === id.toString())) {
    id++;
  }
  return id.toString();
}

function sortContactsForTasks() {
  contactsForTasks.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return nameA.localeCompare(nameB);
  });
}

// function to add the task
async function addTask() {
  const taskInput = readTaskInput();
  let dueDateFormatted = saveDueDateFormatted(taskInput.date);
  const prio = determinePriority();
  let id = getNextAvailableTaskId();
  const task = {
    id: id,
    label: taskInput.category,
    title: taskInput.title,
    description: taskInput.description,
    dueDate: dueDateFormatted,
    assignedTo: checkedCheckboxes,
    priority: prio,
    subtasksOpen: subtasks,
    subtasksDone: [],
    category: "backlog",
  };
  newTask.push(task);
  // dropdownContact = []; nicht mehr notwendig
  if ((authorized === 'guest'))  {
    let div = document.getElementById("guestMessagePopupAddTask");
    let messageText = document.getElementById("guestMessageAddTask");
    resetAddTaskValues();
    showGuestPopupMessage(div, messageText);
  } else {
    users[currentUser].tasks.push(...newTask);
    await setItem("users", JSON.stringify(users));
    resetAddTaskValues();
    addTaskToBoardMessage();
  }
}

function saveDueDateFormatted(dateValue) {
  let dueDateFormatted;
  let unix_timestamp = dateValue; // Unix-Zeitstempel
  let datum = new Date(unix_timestamp); // Erstelle ein neues Date-Objekt und setze den Unix-Zeitstempel
  let tag = datum.getDate(); // Gib den Tag zurück
  let monat = datum.getMonth() + 1; // Gib den Monat zurück und füge 1 hinzu, da Monate bei 0 beginnen
  let jahr = datum.getFullYear(); // Gib das Jahr zurück

  // Führende Nullen für Tag und Monat hinzufügen, wenn sie kleiner als 10 sind
  let tagFormatted = tag < 10 ? "0" + tag : tag;
  let monatFormatted = monat < 10 ? "0" + monat : monat;

  // Setze das Datum im gewünschten Format
  dueDateFormatted = tagFormatted + "/" + monatFormatted + "/" + jahr;
  return dueDateFormatted;
}

function saveDueDateFormatted(dateValue) {
  let dueDateFormatted;
  let unix_timestamp = dateValue; // Unix-Zeitstempel
  let datum = new Date(unix_timestamp); // Erstelle ein neues Date-Objekt und setze den Unix-Zeitstempel
  let tag = datum.getDate(); // Gib den Tag zurück
  let monat = datum.getMonth() + 1; // Gib den Monat zurück und füge 1 hinzu, da Monate bei 0 beginnen
  let jahr = datum.getFullYear(); // Gib das Jahr zurück

  // Führende Nullen für Tag und Monat hinzufügen, wenn sie kleiner als 10 sind
  let tagFormatted = tag < 10 ? "0" + tag : tag;
  let monatFormatted = monat < 10 ? "0" + monat : monat;

  // Setze das Datum im gewünschten Format
  dueDateFormatted = tagFormatted + "/" + monatFormatted + "/" + jahr;
  return dueDateFormatted;
}

function resetAddTaskValues() {
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("task-date").value = "";
  document.getElementById("task-category").value = "";
  document.getElementById("subtask").value = "";
  document.getElementById("contactSelection").innerHTML = "";
  newTask = [];
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
    date: new Date(date),
    category: category,
  };
}

async function updateTaskContacts() {
  if ((authorized === 'guest'))  {
    let resp = await fetch("./JSON/contacts.json");
    contactsForTasks = await resp.json();
  } else {
    let currentUserContactsForTasks = users[currentUser].contacts;
    contactsForTasks = currentUserContactsForTasks;
  }
}

function openDropdown() {
  sortContactsForTasks();
  clearAssignToInput();
  let taskContactDiv = document.getElementById("taskContactDiv");
  if (taskContactDiv.style.display === "flex") {
    taskContactDiv.style.display = "none";
  } else {
    taskContactDiv.style.display = "flex";
    taskContactDiv.innerHTML = "";
    //checkedCheckboxes = [];
    for (let index = 0; index < contactsForTasks.length; index++) {
      const contact = contactsForTasks[index];
      renderContactsDropwdown(contact, index);
    }
    markSelectedContacts();
  }
  // contactsByCheckbox(); wird nicht mehr benötigt
  showContactSelection();
}

function renderContactsDropwdown(contact, index) {
  let letters = contactNamesLetters(contact.name);
  renderDopdownMenu(taskContactDiv, letters, contact, index);
}

/* // Funktion wird nicht mehr benötigt
function getBackgroundColorAssignedContact(contactIndex) {
  return contacts[contactIndex].color;
}
*/

function renderDopdownMenu(taskContactDiv, letters, contact, index) {
  let backgroundColor = contact.color;
  taskContactDiv.innerHTML += `
  <div class="d_f_sb_c width-max dropdown-contact-wrapper" id="wrapper${index}">
    <div class="d_f_fs_c gap-20 dropdown-contact">
      <div class="d_f_c_c contact-circle-small contact-circle-small-letters" id="contactLetters${index}" style="background-color: ${backgroundColor};">${letters}</div> 
      <div class="d_f_fs_c" id="contactName${index}">${contact.name}</div> 
    </div>
    <div class="d_f_fe_c"> 
      <input type="checkbox" id="checkbox${index}" name="checkbox${index}" value="${contact.name}" onclick="handleCheckboxChange(${index})">
    </div>
  </div>
  `;
}

function handleCheckboxChange(index) {
  let wrapper = document.getElementById(`wrapper${index}`);
  let checkbox = document.getElementById(`checkbox${index}`);
  let contactName = document.getElementById(`contactName${index}`);
  if (checkbox.checked) {
    wrapper.style.backgroundColor = "rgba(42, 54, 71, 1)";
    contactName.style.color = "rgba(255, 255, 255, 1)";
    if (!checkedCheckboxes.includes(contactName.textContent)) {
      checkedCheckboxes.push(contactName.textContent);
    }
  } else {
    wrapper.style.backgroundColor = "";
    contactName.style.color = "rgba(0, 0, 0, 1)";
    let indexToRemove = checkedCheckboxes.indexOf(contactName.textContent);
    if (indexToRemove !== -1) {
      checkedCheckboxes.splice(indexToRemove, 1);
    }
  }
  showContactSelection();
}

function markSelectedContacts() {
  for (let index = 0; index < contactsForTasks.length; index++) {
    const contact = contactsForTasks[index];
    const checkbox = document.getElementById(`checkbox${index}`);
    if (checkedCheckboxes.includes(contact.name)) {
      checkbox.checked = true;
      handleCheckboxChange(index);
    }
  }
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

/**
 * This function renders the selected contacts in the contact selection area.
 * Therefore it first loops through the checkedCheckboxes array to find the name of the selected contact.
 * The name is then compared with the contactsForTasks array to find the index of the contact.
 * If the name is found in the array, the initials and background colors are extracted from it.
 */
function showContactSelection() {
  let contactSelection = document.getElementById("contactSelection");
  contactSelection.innerHTML = ``;
  for (let index = 0; index < checkedCheckboxes.length; index++) {
    const contactName = checkedCheckboxes[index];
    const contactIndex = contactsForTasks.findIndex(
      (contact) => contact.name === contactName
    );
    if (contactIndex !== -1) {
      const backgroundColor = contacts[contactIndex].color;
      const letters = contactNamesLetters(contactName);
      contactSelection.innerHTML += `<div class="d_f_c_c contact-circle-small contact-circle-small-letters" style="background-color: ${backgroundColor};">${letters}</div>`;
    }
  }
}

//Change Prio Btn colors!
function setPriority(btnId) {
  removeActiveClasses();
  setActiveClasses(btnId);
}

function resetPriority() {
  removeActiveClasses();
}

//Return Value from Priority!
function determinePriority() {
  let prio = "Medium"; // Standardpriorität
  const urgentBtn = document.getElementById("urgent-btn");
  const mediumBtn = document.getElementById("medium-btn");
  const lowBtn = document.getElementById("low-btn");
  if (urgentBtn.classList.contains("active-prio-btn-urgent")) {
    prio = "Urgent";
  } else if (lowBtn.classList.contains("active-prio-btn-low")) {
    prio = "Low";
  }
  return prio;
}

function setActiveClasses(btnId) {
  const clickedButton = document.getElementById(btnId);
  const buttonSVG = clickedButton.querySelector("svg");
  switch (btnId) {
    case "urgent-btn":
      clickedButton.classList.add("active-prio-btn-urgent");
      buttonSVG.style.fill = "white";
      break;
    case "medium-btn":
      clickedButton.classList.add("active-prio-btn-medium");
      buttonSVG.style.fill = "white";
      break;
    case "low-btn":
      clickedButton.classList.add("active-prio-btn-low");
      buttonSVG.style.fill = "white";
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
    buttonElement.querySelector("svg").style.fill = "";
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

//Event handler to add subtask with enter-key
document.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    if (document.activeElement.id === "subtask") {
      event.preventDefault();
      addSubtask();
    }
  }
});

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
      <div id='subtask${index}' class='d_f_sb_c pad-x-10 subtask'>
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

function changeIcons() {
  let iconBox = document.getElementById("dropdown-icon");
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
   <div onclick="changeIcons()" class='icon-edit-delete'><img src="assets/img/add.svg" alt="plus" /></div>
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
  document.getElementById("contactSelection").innerHTML = "";
  resetPriority();
  dropdownContact = [];
  subtasks = [];
  checkedCheckboxes = [];
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

///////// SEARCHBAR /////////

function clearAssignToInput() {
  let input = document.getElementById("task-assignedTo");
  if (input.placeholder === "Search contact") {
    input.placeholder = "Select contacts to assign";
  } else {
    input.placeholder = "Search contact";
  }
}

function turnArrow() {
  let arrow = document.getElementById("turn-dropdown-arrow");
  arrow.classList.add("rotate-180");
}

function findMatchingContact() {
  clearAssignToInput();
  let searchInput = document
    .getElementById("task-assignedTo")
    .value.trim()
    .toLowerCase();
  if (searchInput === "") {
    openDropdown();
    updateDropdownMenu(contactsForTasks);
  } else {
    let filteredContacts = contactsForTasks.filter((contact) =>
      contact.name.toLowerCase().includes(searchInput)
    );
    if (!isDropdownOpen()) {
      openDropdown();
    }
    updateDropdownMenu(filteredContacts);
  }
}

function isDropdownOpen() {
  let taskContactDiv = document.getElementById("taskContactDiv");
  return taskContactDiv.style.display === "flex";
}

function updateDropdownMenu(contacts) {
  let taskContactDiv = document.getElementById("taskContactDiv");
  taskContactDiv.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    renderContactsDropwdown(contact, i);
  }
}

function closeDropdown() {
  clearAssignToInput();
  let arrow = document.getElementById("turn-dropdown-arrow");
  let taskContactDiv = document.getElementById("taskContactDiv");
  arrow.classList.remove("rotate-180");
  taskContactDiv.style.display = "none";
}

///////// SEARCHBAR ENDE /////////

function addTaskToBoardMessage() {
  const container = document.getElementById("addTaskMessageContainer");
  container.classList.add("add-board-message-btn");
  container.style.display = "flex";

  // Timeout verwenden, um die Klasse "show" hinzuzufügen
  setTimeout(function () {
    container.classList.add("show");

    // Timeout verwenden, um das Element auszublenden
    setTimeout(function () {
      container.classList.remove("show");
      container.style.display = "none";
    }, 900);
  }, 100);
}
