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
  const selectedCategory = taskInput.category;

  if (selectedCategory !== "Technical Task" && selectedCategory !== "User Story") {
    shakeDiv();
    toggleCategoryDiv();
    document.getElementById('task-category').classList.add('required-input-outline-red');
    return;
  }
  let formattedInputDate = await formatDateCorrect(taskInput.date);
  const prio = determinePriority();
  let id = getNextAvailableTaskId();
  const task = {
    id: id,
    label: taskInput.category,
    title: taskInput.title,
    description: taskInput.description,
    dueDate: formattedInputDate,
    assignedTo: checkedCheckboxes,
    priority: prio,
    subtasksOpen: subtasks,
    subtasksDone: [],
    category: "backlog",
  };
  newTask.push(task);
  // dropdownContact = []; nicht mehr notwendig
  if ((authorized === 'guest')) {
    let div = document.getElementById("guestMessagePopupAddTask");
    let messageText = document.getElementById("guestMessageAddTask");
    resetAddTaskValues();
    showGuestPopupMessage(div, messageText);
  } else {
    users[currentUser].tasks.push(...newTask);
    await setItem("users", JSON.stringify(users));
    resetAddTaskValues();
    addTaskToBoardMessage();
    forwardToBoard();
  }
}

function shakeDiv() {
  let container = document.getElementById('requiredDiv');
  container.classList.add('shake');
  setTimeout(() => {
    container.classList.remove('shake');
  }, 500);
}

function forwardToBoard() {
  setTimeout(function () {
    window.location.replace("board.html");
  }, 1600);
}

function resetAddTaskValues() {
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("task-date").value = "";
  document.getElementById("task-category").value = "";
  document.getElementById("subtask").value = "";
  document.getElementById("contactSelection").innerHTML = "";
  document.getElementById('task-category').classList.remove('required-input-outline-red');
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
  if ((authorized === 'guest')) {
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
  let taskContactDiv = document.getElementById("taskContactDiv");
  if (taskContactDiv.style.display === "none") {
    contactSelection.style.display = "flex";
  } else {
    contactSelection.style.display = "none";
  }
  contactSelection.innerHTML = ``;
  for (let index = 0; index < checkedCheckboxes.length; index++) {
    const contactName = checkedCheckboxes[index];
    const contactIndex = contactsForTasks.findIndex(
      (contact) => contact.name === contactName
    );
    if (contactIndex !== -1) {
      const backgroundColor = contactsForTasks[contactIndex].color;
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
  let taskContactDiv = document.getElementById("taskContactDiv");
  if (taskContactDiv.style.display === "flex") {
    taskContactDiv.style.display = "none";
  }
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

async function formatInputDate(input) {
  let dateByValue = new Date(input.value);
  let formattedDate = await formatDateCorrect(dateByValue);
  input.type = 'text';
  input.value = formattedDate;
}

///////// SEARCHBAR /////////

function clearAssignToInput() {
  let input = document.getElementById("task-assignedTo");
  if (input.placeholder === "Search contact") {
    input.placeholder = "Select contacts to assign";
    input.classList.remove("search-placeholder");
  } else {
    input.placeholder = "Search contact";
    input.classList.add("search-placeholder");
  }
}

function turnArrow() {
  let arrow = document.getElementById("turn-dropdown-arrow");
  if (arrow.classList.contains("rotate-180")) {
    arrow.classList.remove("rotate-180");
  } else {
    arrow.classList.add("rotate-180");
  }
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

function setFocusOnInputfield() {
  let inputfield = document.getElementById('task-assignedTo');
  inputfield.focus();
}

function handleClickOnDropdown() {
  if (!isDropdownOpen()) {
    openDropdown();
    turnArrow();
    setFocusOnInputfield();
    showContactSelection();
  } else {
    closeDropdown();
    showContactSelection();
  }
}

function closeDropdown() {
  clearAssignToInput();
  turnArrow();
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

function renderAddTaskFormButton() {
  let urgentBtn = document.getElementById('urgent-btn');
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

  let mediumBtn = document.getElementById('medium-btn');
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

  let lowBtn = document.getElementById('low-btn');
  lowBtn.innerHTML = `
  <p>Low</p>
  <svg class="category-svg-low">
  <path
    d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" />
  <path
    d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" />
</svg>
  `;

}