let newTask = [];
let subtasks = [];
let contactsForTasks = [];
let matchingContactNames = [];
let checkedCheckboxes = [];
let contactsLoaded = false;
let currentSubtaskId;
let templateIndex = 3;
let setCategory = "backlog";


/**
 * This function loads the conctacts and saves them to the array "contactsForTasks"
 * 
 */
async function updateTaskContacts() {
  if (authorized === "guest") {
    let resp = await fetch("./JSON/contacts.json");
    contactsForTasks = await resp.json();
  } else {
    let currentUserContactsForTasks = users[currentUser].contacts;
    contactsForTasks = currentUserContactsForTasks;
  }
}


/**
 * This function includes all functions to adds the newly created task to the board
 * 
 */
async function addTask() {
  if (document.location.pathname === `/board.html` && templateIndex === 3) {
    await initiateFunctionsForAddTaskOnBoard(); // editing an already task on board
  } else {
    await initiateFunctionsForAddTaskForm(); // added a new task to board
  }
}


/////////////////////////////// EDIT ADD-TASK FORM ON BOARD ////////////////////////////////


/**
 * This function resets the values by editing the current task on board.html
 * 
 */
async function initiateFunctionsForAddTaskOnBoard() {
  let editDiv = document.getElementById("boardTaskEditContainer");
  let showDiv = document.getElementById("boardTaskShowContainer");
  let taskInput = readTaskInputEditTask();
  let formattedInputDate;
  if (taskInput.date !== null) {
    formattedInputDate = taskInput.date;
  }
  const prio = determinePriority();
  let currentTask = setValuesAfterEditing(taskInput, formattedInputDate, prio);
  let id = currentTask.id;
  await openBoardTaskPopup(id);
  editDiv.style.display = "none";
  showDiv.style.display = "flex";
}


/**
 * This function gets the input.values
 * 
 */
function readTaskInputEditTask() {
  let title = document.getElementById(`taskTitle-${templateIndex}`).value;
  let description = document.getElementById(`taskDescription-${templateIndex}`).value;
  let date = document.getElementById(`taskDate-${templateIndex}`);
  return {
    title: title,
    description: description,
    date: date.value,
  };
}


/**
 * This function returns the value from priority
 * 
 */
function determinePriority() {
  let prio = "Medium"; // Standardpriorität
  const urgentBtn = document.getElementById(`urgentBtn-${templateIndex}`);
  const mediumBtn = document.getElementById(`mediumBtn-${templateIndex}`);
  const lowBtn = document.getElementById(`lowBtn-${templateIndex}`);
  if (urgentBtn.classList.contains("active-prio-btn-urgent")) {
    prio = "Urgent";
  } else if (lowBtn.classList.contains("active-prio-btn-low")) {
    prio = "Low";
  }
  return prio;
}


/**
 * This function sets and saves the currentTask with the values of taskInput.values
 * 
 * @param {string} taskInput - new task with input.values
 * @param {string} formattedInputDate - formatted date from input.value
 * @param {string} prio - selected priority
 */
async function setValuesAfterEditing(taskInput, formattedInputDate, prio) {
  if (authorized === "guest") {
    currentTask = tasks[currentOpenTaskId];
    setValuesFromBoardForm(currentTask, taskInput, formattedInputDate, prio);
    return currentTask;
  } else {
    currentTask = users[currentUser].tasks[currentOpenTaskId];
    setValuesFromBoardForm(currentTask, taskInput, formattedInputDate, prio);
    await setItem("users", JSON.stringify(users));
    return currentTask;
  }
}


/**
 * This function sets the currentTask with the values of taskInput.values 
 * 
 * @param {string} currentTask - current task
 * @param {string} taskInput - new task with input.values
 * @param {string} formattedInputDate - formatted date from input.value
 * @param {string} prio - selected priority
 */
function setValuesFromBoardForm(currentTask, taskInput, formattedInputDate, prio) {
  currentTask.title = taskInput.title;
  currentTask.description = taskInput.description;
  currentTask.dueDate = formattedInputDate;
  currentTask.assignedTo = checkedCheckboxes;
  currentTask.priority = prio;
  currentTask.subtasksOpen = subtasksOpen;
  currentTask.subtasksDone = subtasksDone;
}


/////////////////////////////// END EDIT ADD-TASK FORM ON BOARD ////////////////////////////////


///////////////////////////////// ADD-TASK FORM ON HTML AND BOARD ////////////////////////////////////


/**
 * This function adds the values by added a new task to board
 * 
 */
async function initiateFunctionsForAddTaskForm() {
  const taskInput = readTaskInput();
  checkCategorySelection(taskInput);
  let formattedInputDate = taskInput.date;
  const prio = determinePriority();
  let id = getNextAvailableTaskId();
  const task = getTaskValues(taskInput, formattedInputDate, prio, id);
  newTask.push(task);
  await saveNewTask();
  resetAddTaskValues();
  if (document.location.pathname === `/board.html` && templateIndex === 3) {
    closeBoardAddTaskPopup();
  }
  addTaskToBoardMessage();
}


/**
 * This function gets the input.values from the add-task-form
 * 
 */
function readTaskInput() {
  const title = document.getElementById(`taskTitle-${templateIndex}`).value;
  const description = document.getElementById(`taskDescription-${templateIndex}`).value;
  const date = document.getElementById(`taskDate-${templateIndex}`);
  const category = document.getElementById(`taskCategory-${templateIndex}`).value;
  return {
    title: title,
    description: description,
    date: date.value,
    category: category,
  };
}


/**
 * This function checks, whether the category inputfield is selected.
 * 
 * @param {string} taskInput - new task with input.values
 */
function checkCategorySelection(taskInput) {
  const selectedCategory = taskInput.category;
  if (selectedCategory !== "Technical Task" && selectedCategory !== "User Story") {
    shakeDiv();
    toggleCategoryDiv();
    document.getElementById(`taskCategory-${templateIndex}`).classList.add("required-input-outline-red");
    return;
  }
}

/**
 * This function shakes the required Text, when a required inputfield is not be filled
 * 
 */
function shakeDiv() {
  let container = document.getElementById(`requiredDiv-${templateIndex}`);
  container.classList.add("shake");
  setTimeout(() => {
    container.classList.remove("shake");
  }, 500);
}


/**
 * This function opens the selection menu from the category-div, if no selection could be registrated
 * 
 */
function toggleCategoryDiv() {
  let categoryDiv = document.getElementById(`categoryDiv-${templateIndex}`);
  let dropdownIcon = document.getElementById(
    `categoryDropIcon-${templateIndex}`
  );
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


/**
 * This function gets the values from input.values
 *
 * @param {string} taskInput - new task with input.values
 * @param {string} formattedInputDate - formatted date from input.value
 * @param {string} prio - selected priority
 * @param {number} id - new id for the task
 */
function getTaskValues(taskInput, formattedInputDate, prio, id) {
  return {
    id: id,
    label: taskInput.category,
    title: taskInput.title,
    description: taskInput.description,
    dueDate: formattedInputDate,
    assignedTo: checkedCheckboxes,
    priority: prio,
    subtasksOpen: subtasks,
    subtasksDone: [],
    category: setCategory,
  };
}


/**
 * This function saves the new task in the array tasks and remote for the user
 * 
 */
async function saveNewTask() {
  if (authorized === "guest") {
    tasks.push(...newTask);
  } else {
    users[currentUser].tasks.push(...newTask);
    await setItem("users", JSON.stringify(users));
  }
}


/**
 * This function resets the values from the inputfields
 * 
 */
function resetAddTaskValues() {
  document.getElementById(`taskTitle-${templateIndex}`).value = "";
  document.getElementById(`taskDescription-${templateIndex}`).value = "";
  document.getElementById(`taskDate-${templateIndex}`).value = "";
  document.getElementById(`taskCategory-${templateIndex}`).value = "";
  document.getElementById(`subtask-${templateIndex}`).value = "";
  document.getElementById(`contactSelection-${templateIndex}`).innerHTML = "";
  document.getElementById(`taskCategory-${templateIndex}`).classList.remove("required-input-outline-red");
  newTask = [];
  subtasks = [];
  checkedCheckboxes = []; // zum Zurücksetzen von den ausgewählten Kontakten im Dropdown Menü
}


///////////////////////////////// END ADD-TASK FORM ON HTML ////////////////////////////////////


///////////////////////////////////////// ADD-SUBTASKS /////////////////////////////////////////


/**
 * This function includes all functions to add the newly subtasks
 * 
 */
async function addSubtask() {
  if (document.location.pathname === `/board.html` && templateIndex === 3) {
    await initiateFunctionsForAddSubtasksOnBoard(); // added new subtasks in the task 
  } else {
    await initiateFunctionsForAddSubtasksForm(); // added new subtasks in the form
  }
}


/**
 * This function includes all functions for editing the subtasks in existing tasks
 * 
 */
async function initiateFunctionsForAddSubtasksOnBoard() {
  const subtaskInput = document.getElementById(`subtask-${templateIndex}`);
  const subtaskValue = subtaskInput.value.trim();
  if (subtaskValue !== "") {
    if (authorized === "guest") {
      let currentTask = tasks[currentOpenTaskId];
      editExistSubtask(currentTask, subtaskValue);
    } else {
      let currentTask = users[currentUser].tasks[currentOpenTaskId];
      editExistSubtask(currentTask, subtaskValue);
    }
    await saveNewUserDate(); // outsourced in script.js
    renderSubtasksPopup(); // outsourced in board.js
    subtaskInput.value = "";
    changeIcons(); // outsourced in renderHTML.js
  }
}


/**
 * This function includes all functions for editing the subtasks in existing tasks
 * 
 * @param {string} currentTask - current task
 * @param {string} subtaskValue - input.value for new subtask
 */
function editExistSubtask(currentTask, subtaskValue) {
  if (currentSubtaskId !== undefined) {
    if (currentSubtaskId.includes("subtasksOpen")) {
      let index = currentSubtaskId.split("Open")[1];
      currentTask.subtasksOpen[index] = subtaskValue;
    } else {
      let index = currentSubtaskId.split("Done")[1];
      currentTask.subtasksDone[index] = subtaskValue;
    }
  } else {
    currentTask.subtasksOpen.push(subtaskValue);
  }
}


/**
 * This function adds new subtasks on the add-task-form
 * 
 */
async function initiateFunctionsForAddSubtasksForm() {
  const subtaskInput = document.getElementById(`subtask-${templateIndex}`);
  const subtaskValue = subtaskInput.value.trim();
  if (subtaskValue !== "") {
    const subtaskContainer = document.getElementById(`subtaskDivAddTask-${templateIndex}`);
    subtasks.push(subtaskValue);
    renderSubtasks(subtaskContainer); // outsourced in renderHTML.js
    subtaskInput.value = "";
    changeIcons(); // outsourced in renderHTML.js
  }
}


///////////////////////////////////// END ADD-SUBTASKS //////////////////////////////////////


///////////////////////////////////////// EDIT SUBTASKS /////////////////////////////////////////


/**
 * This function includes all functions for editing the selected subtask
 * 
 * @param {string} element - element-div from selected subtask
 */
function editSubtask(element) {
  if (document.location.pathname === `/board.html` && templateIndex === 3) {
    initiateFunctionsForEditSubtasksInTask(element); // editing subtasks which are already exist in the task
  } else {
    initiateFunctionsForEditSubtasksInForm(element); // editing subtasks which are already exist in the form
  }
}


/**
 * This function initiate the functions for the user or the guest
 * 
 * @param {string} element - element-div from selected subtask
 */
async function initiateFunctionsForEditSubtasksInTask(element) {
  if (authorized === "guest") {
    let currentTask = tasks[currentOpenTaskId];
    editSubtaskInTask(element, currentTask);
  } else {
    let currentTask = users[currentUser].tasks[currentOpenTaskId];
    editSubtaskInTask(element, currentTask);
  }
}


/**
 * This function checks, whether the selected subtask is open or already done.
 * 
 * @param {string} element - element-div from selected subtask
 * @param {string} currentTask - the current task depends on who is logged in
 */
function editSubtaskInTask(element, currentTask) {
  if (element.id.includes("subtasksOpen")) {
    let index = element.id.split("Open")[1];
    currentSubtaskId = element.id;
    let currentSubtask = currentTask.subtasksOpen[index];
    setSubtaskInputValue(currentSubtask);
  } else {
    let index = element.id.split("Done")[1];
    currentSubtaskId = element.id;
    let currentSubtask = currentTask.subtasksDone[index];
    setSubtaskInputValue(currentSubtask);
  }
}


/**
 * This function checks, whether the selected subtask is open or already done.
 * 
 * @param {string} element - element-div from selected subtask
 * @param {number} index - the position of the "open" or "done" subtask
 * @param {string} currentTask - the current task depends on who is logged in
 */
function setSubtaskInputValue(currentSubtask) {
  if (currentSubtask !== -1) {
    const subtaskInput = document.getElementById(`subtask-${templateIndex}`);
    subtaskInput.value = currentSubtask;
  }
  changeIcons();
}


/**
 * This function edits the selected subtask in the form
 * 
 * @param {string} element - element-div from selected subtask
 */
async function initiateFunctionsForEditSubtasksInForm(element) {
  const subtaskContainer = document.getElementById(`subtaskDivAddTask-${templateIndex}`);
  const subtaskIndex = getSubtaskIndex(subtaskContainer, element);
  if (subtaskIndex !== -1) {
    const subtaskInput = document.getElementById(`subtask-${templateIndex}`);
    subtaskInput.value = subtasks[subtaskIndex];
    subtasks.splice(subtaskIndex, 1);
    renderSubtasks(subtaskContainer); // outsourced in renderHTML.js
  }
  changeIcons();
}


/**
 * This function gets the index of the selected subtask 
 * 
 * @param {string} element - element-div from selected subtask
 * @param {string} subtaskContainer - parent element-div
 */
function getSubtaskIndex(subtaskContainer, element) {
  const subtaskIndex = Array.from(subtaskContainer.children).indexOf(
    element.parentNode.parentNode
  );
  return subtaskIndex;
}


///////////////////////////////////// END EDIT SUBTASKS //////////////////////////////////////


////////////////////////////////////// DELETE SUBTASKS ///////////////////////////////////////


/**
 * This function initiate the delete of the selected subtask
 * 
 * @param {number} i - index of the selected subtask
 */
function deleteSubtask(i) {
  if (document.location.pathname === `/board.html` && templateIndex === 3) {
    if (authorized === "guest") {
      let currentTask = tasks[currentOpenTaskId];
      deleteAndRenderSubtasks(i, currentTask);
    } else {
      let currentTask = users[currentUser].tasks[currentOpenTaskId];
      deleteAndRenderSubtasks(i, currentTask);
    }
  } else {
    subtasks.splice(i, 1);
    document.getElementById(`subtask${i}`).remove();
    const subtaskContainer = document.getElementById(`subtaskDivAddTask-${templateIndex}`);
    renderSubtasks(subtaskContainer); // outsourced in renderHTML.js
  }
}


/**
 * This function delets the subtask from the arrays and renders the subtasks again 
 * 
 * @param {number} i - index of the selected subtask
 */
function deleteAndRenderSubtasks(i, currentTask) {
  if (i.id.includes("subtasksOpen")) {
    let index = i.id.split("Open")[1];
    currentTask.subtasksOpen.splice([index], 1);
    renderSubtasksPopup(); // outsourced in board.js
  } else {
    let index = i.id.split("Done")[1];
    currentTask.subtasksDone.splice([index], 1);
    renderSubtasksPopup(); // outsourced in board.js
  }
}


/////////////////////////////////// END DELETE SUBTASKS /////////////////////////////////////







//Event handler to add subtask with enter-key
document.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    if (document.activeElement.id === `subtask-${templateIndex}`) {
      event.preventDefault();
      addSubtask();
    }
  }
});



function clearSubtaskInput() {
  let subtaskInput = document.getElementById(`subtask-${templateIndex}`);
  subtaskInput.value = "";
  subtaskInput.blur();
  let iconBox = document.getElementById(`dropdownIcon-${templateIndex}`);
  iconBox.innerHTML = `
   <div onclick="changeIcons()" class='icon-edit-delete'><img src="assets/img/add.svg" alt="plus" /></div>
  `;
}


function clearCategory() {
  let categoryDiv = document.getElementById(`categoryDiv-${templateIndex}`);
  if (categoryDiv.style.display === "flex") {
    categoryDiv.style.display = "none";
  }
}


function clearContactDropdown() {
  let taskContactDiv = document.getElementById(
    `taskContactDiv-${templateIndex}`
  );
  if (taskContactDiv.style.display === "flex") {
    taskContactDiv.style.display = "none";
  }
}


//clear the whole form
function clearForm() {
  document.getElementById(`taskTitle-${templateIndex}`).value = "";
  document.getElementById(`taskDescription-${templateIndex}`).value = "";
  document.getElementById(`taskDate-${templateIndex}`).value = "";
  document.getElementById(`taskCategory-${templateIndex}`).value = "";
  document.getElementById(`subtask-${templateIndex}`).value = "";
  document.getElementById(`taskAssignedTo-${templateIndex}`).value = "";
  document.getElementById(`subtaskDivAddTask-${templateIndex}`).innerHTML = "";
  document.getElementById(`contactSelection-${templateIndex}`).innerHTML = "";
  resetPriority();
  clearContactDropdown();
  clearCategory();
  dropdownContact = [];
  subtasks = [];
  checkedCheckboxes = [];
}



//Change Prio Btn colors!
function setPriority(btnId) {
  removeActiveClasses();
  setActiveClasses(btnId);
}


function resetPriority() {
  removeActiveClasses();
}



function removeActiveClasses() {
  const buttons = [
    `urgentBtn-${templateIndex}`,
    `mediumBtn-${templateIndex}`,
    `lowBtn-${templateIndex}`,
  ];
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




function setActiveClasses(btnId) {
  const clickedButton = document.getElementById(`${btnId}-${templateIndex}`);
  const buttonSVG = clickedButton.querySelector("svg");
  switch (btnId) {
    case "urgentBtn":
      clickedButton.classList.add("active-prio-btn-urgent");
      buttonSVG.style.fill = "white";
      break;
    case "mediumBtn":
      clickedButton.classList.add("active-prio-btn-medium");
      buttonSVG.style.fill = "white";
      break;
    case "lowBtn":
      clickedButton.classList.add("active-prio-btn-low");
      buttonSVG.style.fill = "white";
      break;
    default:
      break;
  }
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
  document
    .getElementById(`taskDate-${templateIndex}`)
    .setAttribute("min", minDate);
}


async function formatInputDate(input) {
  let dateByValue = new Date(input.value);
  let formattedDate = await formatDateCorrect(dateByValue);
  input.type = "text";
  input.value = formattedDate;
  // input.valueAsDate = dateByValue;
}


///////// SEARCHBAR /////////

function clearAssignToInput() {
  let input = document.getElementById(`taskAssignedTo-${templateIndex}`);
  if (input.placeholder === "Search contact") {
    input.placeholder = "Select contacts to assign";
    input.classList.remove("search-placeholder");
  } else {
    input.placeholder = "Search contact";
    input.classList.add("search-placeholder");
  }
}


function turnArrow() {
  let arrow = document.getElementById(`turnDropdownArrow-${templateIndex}`);
  if (arrow.classList.contains("rotate-180")) {
    arrow.classList.remove("rotate-180");
  } else {
    arrow.classList.add("rotate-180");
  }
}


function findMatchingContact() {
  clearAssignToInput();
  let searchInput = document
    .getElementById(`taskAssignedTo-${templateIndex}`)
    .value.trim()
    .toLowerCase();
  //console.log("Sucheingabe:", searchInput); // Log der Sucheingabe
  if (searchInput === "") {
    openDropdown();
    updateDropdownMenu(contactsForTasks);
  } else {
    let filteredContacts = contactsForTasks.filter((contact) => {
      let isValidContact =
        contact && contact.name && typeof contact.name === "string";
      //console.log("Verarbeiteter Kontakt:", contact); // Log jeden Kontakts vor der Filterung
      return isValidContact && contact.name.toLowerCase().includes(searchInput);
    });
    //console.log("Gefilterte Kontakte:", filteredContacts); // Log der gefilterten Kontakte
    if (!isDropdownOpen()) {
      openDropdown();
    }
    updateDropdownMenu(filteredContacts);
  }
}



function openDropdown() {
  sortContactsForTasks();
  clearAssignToInput();
  let taskContactDiv = document.getElementById(
    `taskContactDiv-${templateIndex}`
  );
  if (taskContactDiv.style.display === "flex") {
    taskContactDiv.style.display = "none";
  } else {
    taskContactDiv.style.display = "flex";
    taskContactDiv.innerHTML = "";
    //checkedCheckboxes = [];
    for (let index = 0; index < contactsForTasks.length; index++) {
      const contact = contactsForTasks[index];
      renderContactsDropwdown(taskContactDiv, contact, index);
    }
    markSelectedContacts();
  }
  // contactsByCheckbox(); wird nicht mehr benötigt
  showContactSelection();
}


/**
 * This function sorts the contacts
 * 
 */
function sortContactsForTasks() {
  contactsForTasks.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return nameA.localeCompare(nameB);
  });
}


function renderContactsDropwdown(taskContactDiv, contact, index) {
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


function isDropdownOpen() {
  let taskContactDiv = document.getElementById(
    `taskContactDiv-${templateIndex}`
  );
  return taskContactDiv.style.display === "flex";
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



/**
 * This function renders the selected contacts in the contact selection area.
 * Therefore it first loops through the checkedCheckboxes array to find the name of the selected contact.
 * The name is then compared with the contactsForTasks array to find the index of the contact.
 * If the name is found in the array, the initials and background colors are extracted from it.
 */
function showContactSelection() {
  let contactSelection = document.getElementById(
    `contactSelection-${templateIndex}`
  );
  let taskContactDiv = document.getElementById(
    `taskContactDiv-${templateIndex}`
  );
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



function updateDropdownMenu(contacts) {
  let taskContactDiv = document.getElementById(
    `taskContactDiv-${templateIndex}`
  );
  taskContactDiv.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (!contact || !contact.name) {
      console.error(
        "Ungültiger Kontakt oder Name bei updateDropdownMenu:",
        contact
      );
      continue; // Überspringe ungültige Kontakte
    }
    renderContactsDropwdown(taskContactDiv, contact, i);
  }
}


function setFocusOnInputfield() {
  let inputfield = document.getElementById(`taskAssignedTo-${templateIndex}`);
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
  let arrow = document.getElementById(`turnDropdownArrow-${templateIndex}`);
  let taskContactDiv = document.getElementById(
    `taskContactDiv-${templateIndex}`
  );
  arrow.classList.remove("rotate-180");
  taskContactDiv.style.display = "none";
}


///////// SEARCHBAR ENDE /////////

/**
 * This function handles the display of success messages and specific actions based on the page URL.
 * It determines the context (Add Task or Board) and performs actions accordingly.
 */
function addTaskToBoardMessage() {
  if (document.location.pathname.includes("add-task.html")) {
    showSuccessMessage();
    handleAddTaskPageActions();
  }
  if (document.location.pathname.includes("board.html")) {
    closeBoardAddTaskPopup();
    showSuccessMessage();
    handleBoardPageActions();
  }
}


/**
 * This function handles specific actions on the 'Add Task' page
 * and manages the guest message popup and navigation for authenticated users.
 */
function handleAddTaskPageActions() {
  if (authorized === "guest") {
    let div = document.getElementById("guestMessagePopupAddTask");
    let messageText = document.getElementById("guestMessageAddTask");
    showGuestPopupMessage(div, messageText);
  } else {
    forwardToBoard();
  }
}


/**
 * This function handles specific actions on the 'Board' page
 * and manages the guest message popup and navigation for authenticated users.
 */
function handleBoardPageActions() {
  if (authorized === "guest") {
    let div = document.getElementById("guestMessagePopupBoard");
    let messageText = document.getElementById("guestMessageBoard");
    showGuestPopupMessage(div, messageText);
  }
}


/**
 * This function displays a success message with an animation that shows and then hides the message.
 * It animates the success message container to provide visual feedback to the user.
 */
function showSuccessMessage() {
  let container = document.getElementById("addTaskMessageContainer");
  container.classList.add("add-board-message-btn");
  container.style.display = "flex";
  setTimeout(function () {
    container.classList.add("show");
    setTimeout(function () {
      container.classList.remove("show");
      container.style.display = "none";
    }, 1500);
  }, 100);
}


/**
 * This function navigates to the board page after a delay.
 */
function forwardToBoard() {
  setTimeout(function () {
    window.location.replace("board.html");
  }, 2000);
}


function closeAddTaskMenuDiv() {
  let taskContactDiv = document.getElementById(
    `taskContactDiv-${templateIndex}`
  );
  let categoryDiv = document.getElementById(`categoryDiv-${templateIndex}`);
  if (taskContactDiv.style.display === "flex") {
    closeDropdown();
  }
  taskContactDiv.style.display = "none";
  categoryDiv.style.display = "none";
}


function changeTemplateIndex() {
  templateIndex = 4;
}



//// OTHER /// 

// for category section
function chooseCategory(category) {
  document.getElementById(`taskCategory-${templateIndex}`).value =
    category.innerText;
}