let newTask = [];
// let dropdownContact = [];  Nicht mehr notwendig
let subtasks = [];
let contactsForTasks = [];
let matchingContactNames = [];
let checkedCheckboxes = []; // Array zur Speicherung der ausgewählten Checkboxen im Dropdown Menü
let contactsLoaded = false;
let currentSubtaskId;

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
  if (document.location.pathname === `/board.html`) {   // edit feature for edit tasks on board
    let boardTaskEditContainer = document.getElementById('boardTaskEditContainer');
    let boardTaskShowContainer = document.getElementById('boardTaskShowContainer');
    const taskInput = readTaskInputEditTask();
    let formattedInputDate = await formatDateCorrect(taskInput.date);
    const prio = determinePriority();
    if ((authorized === 'guest')) {
      let currentTask = tasks[currentOpenTaskId];
      currentTask.title = taskInput.title;
      currentTask.description = taskInput.description;
      currentTask.dueDate = formattedInputDate;
      currentTask.assignedTo = checkedCheckboxes;
      currentTask.priority = prio;
      currentTask.subtasksOpen = subtasksOpen;
      currentTask.subtasksDone = subtasksDone;
      let id = currentTask.id;
      await openBoardTaskPopup(id);
    } else {
      let currentTask = users[currentUser].tasks[currentOpenTaskId];
      currentTask.title = taskInput.title;
      currentTask.description = taskInput.description;
      currentTask.dueDate = formattedInputDate;
      currentTask.assignedTo = checkedCheckboxes;
      currentTask.priority = prio;
      currentTask.subtasksOpen = subtasksOpen;
      currentTask.subtasksDone = subtasksDone;
      await setItem("users", JSON.stringify(users));
      let id = currentTask.id;
      await openBoardTaskPopup(id);
    }
    boardTaskEditContainer.style.display = 'none';
    boardTaskShowContainer.style.display = 'flex';

  } else { // add-task feature on add-task.html
    const taskInput = readTaskInput();
    const selectedCategory = taskInput.category;

    if (selectedCategory !== "Technical Task" && selectedCategory !== "User Story") {
      shakeDiv();
      toggleCategoryDiv();
      document.getElementById('taskCategory').classList.add('required-input-outline-red');
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
    if ((authorized === 'guest')) {
      tasks.push(...newTask);
      resetAddTaskValues();
    } else {
      users[currentUser].tasks.push(...newTask);
      await setItem("users", JSON.stringify(users));
      resetAddTaskValues();
    }
    addTaskToBoardMessage();
  }
}

function shakeDiv() {
  let container = document.getElementById('requiredDiv');
  container.classList.add('shake');
  setTimeout(() => {
    container.classList.remove('shake');
  }, 500);
}

function resetAddTaskValues() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskCategory").value = "";
  document.getElementById("subtask").value = "";
  document.getElementById("contactSelection").innerHTML = "";
  document.getElementById('taskCategory').classList.remove('required-input-outline-red');
  newTask = [];
  subtasks = [];
  checkedCheckboxes = []; // zum Zurücksetzen von den ausgewählten Kontakten im Dropdown Menü
}

//get informations from input
function readTaskInput() {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const date = document.getElementById("taskDate").value;
  const category = document.getElementById("taskCategory").value;
  const subtask = document.getElementById("subtask").value;
  return {
    title: title,
    description: description,
    date: new Date(date),
    category: category,
  };
}

//get informations from input
function readTaskInputEditTask() {
  const title = document.getElementById("taskTitle").value;
  const description = document.getElementById("taskDescription").value;
  const date = document.getElementById("taskDate").value;
  const subtask = document.getElementById("subtask").value;
  return {
    title: title,
    description: description,
    date: new Date(date)
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
      renderContactsDropwdown(taskContactDiv, contact, index);
    }
    markSelectedContacts();
  }
  // contactsByCheckbox(); wird nicht mehr benötigt
  showContactSelection();
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
  const urgentBtn = document.getElementById("urgentBtn");
  const mediumBtn = document.getElementById("mediumBtn");
  const lowBtn = document.getElementById("lowBtn");
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

function removeActiveClasses() {
  const buttons = ["urgentBtn", "mediumBtn", "lowBtn"];
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
  document.getElementById("taskCategory").value = category.innerText;
}

function toggleCategoryDiv() {
  let categoryDiv = document.getElementById("categoryDiv");
  let dropdownIcon = document.getElementById("categoryDropIcon");
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
  if (document.location.pathname === `/board.html`) {
    if ((authorized === 'guest')) {
      const subtaskInput = document.getElementById("subtask");
      const subtaskValue = subtaskInput.value.trim();
      if (subtaskValue !== "") {
        const subtaskContainer = document.getElementById("subtaskDivAddTask");
        let currentTask = tasks[currentOpenTaskId];
        if (currentSubtaskId !== undefined) {
          if (currentSubtaskId.includes('subtasksOpen')) {
            let index = currentSubtaskId.split('Open')[1];
            currentTask.subtasksOpen[index] = subtaskValue;
          } else {
            let index = currentSubtaskId.split('Done')[1];
            currentTask.subtasksDone[index] = subtaskValue;
          }
        } else {
          currentTask.subtasksOpen.push(subtaskValue);
        }
        renderSubtasksPopup();
        subtaskInput.value = "";
        changeIcons();
      }
    } else {
      const subtaskInput = document.getElementById("subtask");
      const subtaskValue = subtaskInput.value.trim();
      if (subtaskValue !== "") {
        const subtaskContainer = document.getElementById("subtaskDivAddTask");
        let currentTask = users[currentUser].tasks[currentOpenTaskId];
        if (currentSubtaskId !== undefined) {
          if (currentSubtaskId.includes('subtasksOpen')) {
            let index = currentSubtaskId.split('Open')[1];
            currentTask.subtasksOpen[index] = subtaskValue;
          } else {
            let index = currentSubtaskId.split('Done')[1];
            currentTask.subtasksDone[index] = subtaskValue;
          }
        } else {
          currentTask.subtasksOpen.push(subtaskValue);
          setItem("users", JSON.stringify(users));
        }
        renderSubtasksPopup();
        subtaskInput.value = "";
        changeIcons();
      }
      /*

      await setItem("users", JSON.stringify(users)); */
    }
  } else {
    const subtaskInput = document.getElementById("subtask");
    const subtaskValue = subtaskInput.value.trim();
    if (subtaskValue !== "") {
      const subtaskContainer = document.getElementById("subtaskDivAddTask");
      subtasks.push(subtaskValue);
      renderSubtasks(subtaskContainer);
      subtaskInput.value = "";
      changeIcons();
    }
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
  const subtaskContainer = document.getElementById("subtaskDivAddTask");
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
  let iconBox = document.getElementById("dropdownIcon");
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
  if (document.location.pathname === `/board.html`) {

    if ((authorized === 'guest')) {
      let currentTask = tasks[currentOpenTaskId];
      // currentTask.title = taskInput.title;
      if (element.id.includes('subtasksOpen')) {
        currentSubtaskId = element.id; // global var for addSubtask()
        let index = element.id.split('Open')[1];
        let currentSubtask = currentTask.subtasksOpen[index];
        const subtaskContainer = document.getElementById("subtaskDivAddTask");
        if (currentSubtask !== -1) {
          const subtaskInput = document.getElementById("subtask");
          subtaskInput.value = currentSubtask;
        }
        changeIcons();
      } else {
        currentSubtaskId = element.id; // global var for addSubtask()
        let index = element.id.split('Done')[1];
        let currentSubtask = currentTask.subtasksDone[index];
        const subtaskContainer = document.getElementById("subtaskDivAddTask");
        if (currentSubtask !== -1) {
          const subtaskInput = document.getElementById("subtask");
          subtaskInput.value = currentSubtask;
        }
        changeIcons();
      }
    } else {
      let currentTask = users[currentUser].tasks[currentOpenTaskId];
      if (element.id.includes('subtasksOpen')) {
        currentSubtaskId = element.id; // global var for addSubtask()
        let index = element.id.split('Open')[1];
        let currentSubtask = currentTask.subtasksOpen[index];
        const subtaskContainer = document.getElementById("subtaskDivAddTask");
        if (currentSubtask !== -1) {
          const subtaskInput = document.getElementById("subtask");
          subtaskInput.value = currentSubtask;
        }
        changeIcons();
      } else {
        currentSubtaskId = element.id; // global var for addSubtask()
        let index = element.id.split('Done')[1];
        let currentSubtask = currentTask.subtasksDone[index];
        const subtaskContainer = document.getElementById("subtaskDivAddTask");
        if (currentSubtask !== -1) {
          const subtaskInput = document.getElementById("subtask");
          subtaskInput.value = currentSubtask;
        }
        changeIcons();
      }
    }
  } else {
    const subtaskContainer = document.getElementById("subtaskDivAddTask");
    const subtaskIndex = getSubtaskIndex(element);
    if (subtaskIndex !== -1) {
      const subtaskInput = document.getElementById("subtask");
      subtaskInput.value = subtasks[subtaskIndex];
      subtasks.splice(subtaskIndex, 1);
      renderSubtasks(subtaskContainer);
    }
    changeIcons();
  }
}

function deleteSubtask(i) {
  if (document.location.pathname === `/board.html`) {
    if ((authorized === 'guest')) {
      let currentTask = tasks[currentOpenTaskId];
      if (i.id.includes('subtasksOpen')) {
        let index = i.id.split('Open')[1];
        currentTask.subtasksOpen.splice([index], 1);
        renderSubtasksPopup();
      } else {
        let index = i.id.split('Done')[1];
        currentTask.subtasksDone.splice([index], 1);
          renderSubtasksPopup();
      }
    } else {
      let currentTask = users[currentUser].tasks[currentOpenTaskId];
      if (i.id.includes('subtasksOpen')) {
        let index = i.id.split('Open')[1];
        currentTask.subtasksOpen.splice([index], 1);
        renderSubtasksPopup();
      } else {
        let index = i.id.split('Done')[1];
        currentTask.subtasksDone.splice([index], 1);
        renderSubtasksPopup();
      }
    }
  } else {
    subtasks.splice(i, 1);
    document.getElementById(`subtask${i}`).remove();
  }
}

function clearSubtaskInput() {
  let subtaskInput = document.getElementById("subtask");
  subtaskInput.value = "";
  subtaskInput.blur();
  let iconBox = document.getElementById("dropdownIcon");
  iconBox.innerHTML = `
   <div onclick="changeIcons()" class='icon-edit-delete'><img src="assets/img/add.svg" alt="plus" /></div>
  `;
}

function clearCategory() {
  let categoryDiv = document.getElementById("categoryDiv");
  if (categoryDiv.style.display === "flex") {
    categoryDiv.style.display = "none";
  }
}

function clearContactDropdown() {
  let taskContactDiv = document.getElementById("taskContactDiv");
  if (taskContactDiv.style.display === "flex") {
    taskContactDiv.style.display = "none";
  }
}

//clear the whole form
function clearForm() {
  document.getElementById("taskTitle").value = "";
  document.getElementById("taskDescription").value = "";
  document.getElementById("taskDate").value = "";
  document.getElementById("taskCategory").value = "";
  document.getElementById("subtask").value = "";
  document.getElementById("taskAssignedTo").value = "";
  document.getElementById("subtaskDivAddTask").innerHTML = "";
  document.getElementById("contactSelection").innerHTML = "";
  resetPriority();
  clearContactDropdown();
  clearCategory();
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
  document.getElementById("taskDate").setAttribute("min", minDate);
}

async function formatInputDate(input) {
  let dateByValue = new Date(input.value);
  let formattedDate = await formatDateCorrect(dateByValue);
  input.valueAsDate = dateByValue;
}


///////// SEARCHBAR /////////

function clearAssignToInput() {
  let input = document.getElementById("taskAssignedTo");
  if (input.placeholder === "Search contact") {
    input.placeholder = "Select contacts to assign";
    input.classList.remove("search-placeholder");
  } else {
    input.placeholder = "Search contact";
    input.classList.add("search-placeholder");
  }
}

function turnArrow() {
  let arrow = document.getElementById("turnDropdownArrow");
  if (arrow.classList.contains("rotate-180")) {
    arrow.classList.remove("rotate-180");
  } else {
    arrow.classList.add("rotate-180");
  }
}

function findMatchingContact() {
  clearAssignToInput();
  let searchInput = document
    .getElementById("taskAssignedTo")
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
  let inputfield = document.getElementById('taskAssignedTo');
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
  let arrow = document.getElementById("turnDropdownArrow");
  let taskContactDiv = document.getElementById("taskContactDiv");
  arrow.classList.remove("rotate-180");
  taskContactDiv.style.display = "none";
}

///////// SEARCHBAR ENDE /////////
function addTaskToBoardMessage() {
  if (document.location.pathname.includes('add-task.html')) {
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
      }, 1500);
    }, 100);

    if ((authorized === 'guest')) {
      let div = document.getElementById('guestMessagePopupAddTask');
      let messageText = document.getElementById('guestMessageAddTask');
      showGuestPopupMessage(div, messageText);
    } else {
      forwardToBoard();
    }
  }

  if (document.location.pathname.includes('board.html')) {
    closeBoardAddTaskPopup();
    if ((authorized === 'guest')) {
      let div = document.getElementById('guestMessagePopupBoard');
      let messageText = document.getElementById('guestMessageBoard');
      showGuestPopupMessage(div, messageText);
    }
  }
}

function forwardToBoard() {
  setTimeout(function () {
    window.location.replace("board.html");
  }, 2000);
}

function closeAddTaskMenuDiv() {
  let taskContactDiv = document.getElementById("taskContactDiv");
  categoryDiv = document.getElementById("categoryDiv");
  taskContactDiv.style.display = "none";
  categoryDiv.style.display = "none";
}