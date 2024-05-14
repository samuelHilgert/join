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
    await initiateFunctionsForAddTaskOnBoard(); 
  } else {
    await initiateFunctionsForAddTaskForm(); 
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
  let dropdownIcon = document.getElementById(`categoryDropIcon-${templateIndex}`);
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
  checkedCheckboxes = [];
}


///////////////////////////////// END ADD-TASK FORM ON HTML ////////////////////////////////////


///////////////////////////////////////// ADD-SUBTASKS /////////////////////////////////////////


/**
 * This function includes all functions to add the newly subtasks
 * 
 */
async function addSubtask() {
  if (document.location.pathname === `/board.html` && templateIndex === 3) {
    await initiateFunctionsForAddSubtasksOnBoard(); 
  } else {
    await initiateFunctionsForAddSubtasksForm(); 
  }
}


/**
 * This function retrieves the current task based on the user's authorization level.
 * It decides which task list to access (either a general task list or a user-specific task list)
 * depending on whether the user is logged in as a guest or as a registered user.
 *
 * @returns {Object} - The current task object from either the general task list or the user-specific task list.
 */
function getCurrentTask() {
  return authorized === "guest" ? tasks[currentOpenTaskId] : users[currentUser].tasks[currentOpenTaskId];
}


/**
 * This function includes all functions for editing the subtasks in existing tasks
 * 
 */
async function initiateFunctionsForAddSubtasksOnBoard() {
  const subtaskInput = document.getElementById(`subtask-${templateIndex}`);
  const subtaskValue = subtaskInput.value.trim();
  if (subtaskValue !== "") {
    let currentTask = getCurrentTask();
    editExistSubtask(currentTask, subtaskValue);
    await saveNewUserDate(); 
    renderSubtasksPopup(); 
    subtaskInput.value = "";
    changeIcons(); 
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
    renderSubtasks(subtaskContainer); 
    subtaskInput.value = "";
    changeIcons(); 
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
    initiateFunctionsForEditSubtasksInTask(element); 
  } else {
    initiateFunctionsForEditSubtasksInForm(element); 
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
    renderSubtasks(subtaskContainer);
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
 * This function returns the current task based on user authorization level.
 * @returns {Object} - The current task object.
 */
function getCurrentTaskForDeletion() {
  return authorized === "guest" ? tasks[currentOpenTaskId] : users[currentUser].tasks[currentOpenTaskId];
}


/**
 * This function deletes a subtask and re-renders the subtasks UI for the board page when templateIndex is 3.
 * @param {number} index - The index of the subtask to delete.
 * @param {Object} currentTask - The current task object containing the subtasks.
 */
function deleteSubtaskForBoard(index, currentTask) {
  deleteAndRenderSubtasks(index, currentTask);
}


/**
 * This function deletes a subtask from the subtasks array and updates the DOM for non-board pages or different template indices.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtaskForOtherPages(index) {
  subtasks.splice(index, 1);
  document.getElementById(`subtask${index}`).remove();
  const subtaskContainer = document.getElementById(`subtaskDivAddTask-${templateIndex}`);
  renderSubtasks(subtaskContainer);
}


/**
 * This function deletes a subtask based on the page path, template index, and user authorization.
 * @param {number} i - The index of the subtask to delete.
 */
function deleteSubtask(i) {
  if (document.location.pathname === `/board.html` && templateIndex === 3) {
    const currentTask = getCurrentTaskForDeletion();
    deleteSubtaskForBoard(i, currentTask);
  } else {
    deleteSubtaskForOtherPages(i);
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
    renderSubtasksPopup();
  } else {
    let index = i.id.split("Done")[1];
    currentTask.subtasksDone.splice([index], 1);
    renderSubtasksPopup();
  }
}

/////////////////////////////////// END DELETE SUBTASKS /////////////////////////////////////


/**
 * Event listener for handling keypress events across the document.
 * Specifically, it checks for the 'Enter' key press (keyCode 13) when the focus is on the subtask input.
 * If the 'Enter' key is pressed while focused on the specified input, it prevents the default form submission
 * and triggers the addition of a subtask.
 */
document.addEventListener("keypress", function (event) {
  if (event.keyCode === 13) {
    if (document.activeElement.id === `subtask-${templateIndex}`) {
      event.preventDefault();
      addSubtask();
    }
  }
});


/**
 * This function clears the input field for subtasks, removes focus from it, and updates the dropdown icon.
 * It is typically called to reset the subtask input area after a subtask has been added or when clearing the input is needed.
 */
function clearSubtaskInput() {
  let subtaskInput = document.getElementById(`subtask-${templateIndex}`);
  subtaskInput.value = "";
  subtaskInput.blur();
  let iconBox = document.getElementById(`dropdownIcon-${templateIndex}`);
  iconBox.innerHTML = `
   <div onclick="changeIcons()" class='icon-edit-delete'><img src="assets/img/add.svg" alt="plus" /></div>
  `;
}


/**
 * This function hides the category division if it is currently displayed as a flexbox.
 * Therefore it checks if the category division (a UI element identified by a specific ID) is visible
 * and sets its display style to 'none', effectively hiding it from view.
 */
function clearCategory() {
  let categoryDiv = document.getElementById(`categoryDiv-${templateIndex}`);
  if (categoryDiv.style.display === "flex") {
    categoryDiv.style.display = "none";
  }
}


/**
 * This function hides the contact dropdown if it is currently displayed as a flexbox.
 * It targets a specific UI element for contact details and hides it if it's displayed. 
 */
function clearContactDropdown() {
  let taskContactDiv = document.getElementById(
    `taskContactDiv-${templateIndex}`
  );
  if (taskContactDiv.style.display === "flex") {
    taskContactDiv.style.display = "none";
  }
}


/**
 * This function resets the Arrays and is called when the form is 
 * cleared or submitted to ensure a clean state.
 */
function resetArrays() {
  dropdownContact = [];
  subtasks = [];
  checkedCheckboxes = [];
}


/**
 * This function clears all input fields and resets selections within a form, identified by a dynamic template index.
 * It resets values and innerHTML of various task-related input fields and elements
 * to prepare for new data entry or to clear the current state.
 */
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
  resetArrays();
}


/**
 * This function sets priority for a task based on the provided button ID.
 * Therefore it adds active classes to the priority button to indicate selection,
 * while removing active classes from other buttons to maintain exclusive selection.
 * @param {string} btnId - The ID of the button that is to be marked as active.
 */
function setPriority(btnId) {
  removeActiveClasses();
  setActiveClasses(btnId);
}


/**
 * This function resets the visual indication of task priority by removing active 
 * classes from priority buttons.
 */
function resetPriority() {
  removeActiveClasses();
}


/**
 * This function removes specific active classes from priority buttons and resets the styles of their contained SVG elements.
 * It targets buttons by their dynamic IDs based on the template index.
 */
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


/**
 * This function adds a specified class to a button and sets the fill color of its SVG element.
 * @param {HTMLElement} button - The button to modify.
 * @param {string} className - The class name to add to the button.
 * @param {string} fill - The color to set as the SVG fill.
 */
function activateButton(button, className, fill) {
  if (button) {
    button.classList.add(className);
    const buttonSVG = button.querySelector("svg");
    if (buttonSVG) {
      buttonSVG.style.fill = fill;
    }
  }
}


/**
 * This function sets active classes on buttons based on the button ID to indicate priority.
 * It adjusts the class and style of the button and its contained SVG element
 * according to the specified priority level.
 * @param {string} btnId - The ID suffix of the button that is clicked.
 */
function setActiveClasses(btnId) {
  const clickedButton = document.getElementById(`${btnId}-${templateIndex}`);
  switch (btnId) {
    case "urgentBtn":
      activateButton(clickedButton, "active-prio-btn-urgent", "white");
      break;
    case "mediumBtn":
      activateButton(clickedButton, "active-prio-btn-medium", "white");
      break;
    case "lowBtn":
      activateButton(clickedButton, "active-prio-btn-low", "white");
      break;
    default:
      break;
  }
}


/**
 * This function rotates the dropdown icon based on whether the dropdown is open or not.
 * It applies a CSS transform to rotate the icon element by 180 degrees when the dropdown is open,
 * and resets the transform when it is closed, effectively toggling the icon's orientation.
 *
 * @param {HTMLElement} icon - The DOM element representing the dropdown icon.
 * @param {boolean} isOpen - A boolean value indicating whether the dropdown is currently open.
 */
function rotateDropdownIcon(icon, isOpen) {
  if (isOpen) {
    icon.style.transform = "rotate(180deg)";
  } else {
    icon.style.transform = "";
  }
}


/**
 * This function sets the minimum date that can be selected in a date input field to today's date.
 * It ensures that users cannot select a date earlier than the current date.
 */
function setMinimumDate() {
  var currentDate = new Date();
  var minDate = currentDate.toISOString().split("T")[0];
  document
    .getElementById(`taskDate-${templateIndex}`)
    .setAttribute("min", minDate);
}


/**
 * This function converts the date from a date input field to a formatted string and sets the input type to text.
 * It is used to format the date selected by a user into a more readable format
 * and displays it in a text input for smoother further processing.
 *
 * @param {HTMLInputElement} input - The input element that contains the date to be formatted.
 * @returns {Promise<void>} - A promise that resolves when the date has been formatted and the input has been updated.
 */
async function formatInputDate(input) {
  let dateByValue = new Date(input.value);
  let formattedDate = await formatDateCorrect(dateByValue);
  input.type = "text";
  input.value = formattedDate;
}


///////// SEARCHBAR /////////


/**
 * This function toggles the placeholder text and the associated class of the "taskAssignedTo" input field.
 * It alternates the placeholder between "Search contact" and "Select contacts to assign".
 * This is used to indicate whether the input field is in a search mode or in a selection mode to the user.
 */
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


/**
 * This function toggles the rotation state of an arrow icon.
 * It checks if the arrow icon currently has the "rotate-180" class and toggles it.
 */
function turnArrow() {
  let arrow = document.getElementById(`turnDropdownArrow-${templateIndex}`);
  if (arrow.classList.contains("rotate-180")) {
    arrow.classList.remove("rotate-180");
  } else {
    arrow.classList.add("rotate-180");
  }
}


/**
 * This function filters contacts based on the provided search input.
 * @param {Array} contacts - The array of contact objects.
 * @param {string} searchInput - The search term used to filter contacts.
 * @returns {Array} - An array of contacts that match the search term.
 */
function filterContacts(contacts, searchInput) {
  return contacts.filter(contact => {
    let isValidContact = contact && contact.name && typeof contact.name === "string";
    return isValidContact && contact.name.toLowerCase().includes(searchInput);
  });
}


/**
 * This function ensures the dropdown is open and updates it with the provided data.
 * @param {Array} contacts - The contacts to display in the dropdown menu.
 */
function manageDropdown(contacts) {
  if (!isDropdownOpen()) {
    openDropdown();
  }
  updateDropdownMenu(contacts);
}


/**
 * This function handles search operations to find matching contacts and update the dropdown menu accordingly.
 */
function findMatchingContact() {
  clearAssignToInput();
  let searchInput = document.getElementById(`taskAssignedTo-${templateIndex}`).value.trim().toLowerCase();
  if (searchInput === "") {
    openDropdown();
    updateDropdownMenu(contactsForTasks);
  } else {
    let filteredContacts = filterContacts(contactsForTasks, searchInput);
    manageDropdown(filteredContacts);
  }
}


/**
 * This function toggles the display of the dropdown menu for assigning contacts to tasks.
 * @param {HTMLElement} element - The dropdown menu element.
 */
function toggleDropdownDisplay(element) {
  if (element.style.display === "flex") {
    element.style.display = "none";
  } else {
    element.style.display = "flex";
    element.innerHTML = ""; // Clear previous content when opening.
  }
}


/**
 * This function renders contacts in the dropdown.
 * @param {HTMLElement} container - The container where contacts should be displayed.
 * @param {Array} contacts - Array of contact objects.
 */
function populateDropdownWithContacts(container, contacts) {
  for (let index = 0; index < contacts.length; index++) {
    const contact = contacts[index];
    renderContactsDropwdown(container, contact, index);
  }
}


/**
 * This function handles the opening and population of the dropdown menu for task contact selection.
 */
function openDropdown() {
  sortContactsForTasks();
  clearAssignToInput();
  let taskContactDiv = document.getElementById(`taskContactDiv-${templateIndex}`);
  toggleDropdownDisplay(taskContactDiv);
  if (taskContactDiv.style.display === "flex") { 
    populateDropdownWithContacts(taskContactDiv, contactsForTasks);
    markSelectedContacts();
  }
  showContactSelection(); 
}


/**
 * This function sorts the global `contactsForTasks` array alphabetically by contact names.
 * It modifies the array by sorting its elements based on the lowercase comparison
 * of contact names, ensuring a consistent, case-insensitive alphabetical order.
 */
function sortContactsForTasks() {
  contactsForTasks.sort((a, b) => {
    const nameA = a.name.toLowerCase();
    const nameB = b.name.toLowerCase();
    return nameA.localeCompare(nameB);
  });
}


/**
 * This function renders contacts within a specified HTML container.
 *
 * @param {HTMLElement} taskContactDiv - The DOM element where contacts should be rendered.
 * @param {Object} contact - The contact object containing details like name and other properties.
 * @param {number} index - The index of the current contact in the contacts array, used for unique DOM IDs.
 */
function renderContactsDropwdown(taskContactDiv, contact, index) {
  let letters = contactNamesLetters(contact.name);
  renderDopdownMenu(taskContactDiv, letters, contact, index);
}


/**
 * This function renders a dropdown menu item for a contact in the specified container.
 *
 * @param {HTMLElement} taskContactDiv - The container where the dropdown menu is being rendered.
 * @param {string} letters - Initials or letters to display in the contact circle.
 * @param {Object} contact - The contact data, including properties like name and color.
 * @param {number} index - The index of the contact in the list to provide unique IDs for HTML elements.
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


/**
 * This function checks if the dropdown menu is currently open.
 * It determines the visibility of the dropdown menu by checking the display style
 * of the dropdown container.
 *
 * @returns {boolean} - True if the dropdown menu is displayed ('flex'), otherwise false.
 */
function isDropdownOpen() {
  let taskContactDiv = document.getElementById(
    `taskContactDiv-${templateIndex}`
  );
  return taskContactDiv.style.display === "flex";
}


/**
 * This function updates the UI based on the checkbox state.
 * 
 * @param {HTMLElement} wrapper - The wrapper element of the contact.
 * @param {HTMLElement} contactName - The element displaying the contact's name.
 * @param {boolean} isChecked - The state of the checkbox, either checked or not.
 */
function updateCheckboxUI(wrapper, contactName, isChecked) {
  if (isChecked) {
    wrapper.style.backgroundColor = "rgba(42, 54, 71, 1)";
    contactName.style.color = "rgba(255, 255, 255, 1)";
  } else {
    wrapper.style.backgroundColor = "";
    contactName.style.color = "rgba(0, 0, 0, 1)";
  }
}

/**
 * This function manages the list of checked checkboxes.
 * 
 * @param {string} contactName - The name of the contact to add or remove from the list.
 * @param {boolean} isChecked - Whether to add or remove the contact.
 */
function manageCheckedList(contactName, isChecked) {
  if (isChecked) {
    if (!checkedCheckboxes.includes(contactName)) {
      checkedCheckboxes.push(contactName);
    }
  } else {
    let indexToRemove = checkedCheckboxes.indexOf(contactName);
    if (indexToRemove !== -1) {
      checkedCheckboxes.splice(indexToRemove, 1);
    }
  }
}


/**
 * This function handles changes to the checkbox state and updates both UI and the list of checked checkboxes.
 * 
 * @param {number} index - The index of the checkbox being changed.
 */
function handleCheckboxChange(index) {
  let wrapper = document.getElementById(`wrapper${index}`);
  let checkbox = document.getElementById(`checkbox${index}`);
  let contactName = document.getElementById(`contactName${index}`);
  updateCheckboxUI(wrapper, contactName, checkbox.checked);
  manageCheckedList(contactName.textContent, checkbox.checked);
}


/**
 * This function iterates over all contacts and marks the checkboxes for those that have been selected.
 * It checks each contact against a list of already selected contacts (`checkedCheckboxes`).
 * If a contact is found in the list, its corresponding checkbox is set to checked, and the UI is updated
 * to reflect this selection via `handleCheckboxChange`.
 */
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
  let contactSelection = document.getElementById(`contactSelection-${templateIndex}`);
  let taskContactDiv = document.getElementById(`taskContactDiv-${templateIndex}`);
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
  let taskContactDiv = document.getElementById(`taskContactDiv-${templateIndex}`);
  taskContactDiv.innerHTML = "";
  for (let i = 0; i < contacts.length; i++) {
    const contact = contacts[i];
    if (!contact || !contact.name) {
      console.error("Ungültiger Kontakt oder Name bei updateDropdownMenu:", contact);
      continue;
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
  let taskContactDiv = document.getElementById(`taskContactDiv-${templateIndex}`);
  let categoryDiv = document.getElementById(`categoryDiv-${templateIndex}`);
  if (taskContactDiv.style.display === "flex") {
    handleClickOnDropdown();
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