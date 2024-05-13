let categories = ["backlog", "inProgress", "awaitFeedback", "done"];
let currentDraggedTaskId;
let currentOpenTaskId;
let taskId;
let subtasksOpen = [];
let subtasksDone = [];
let timerMobileTodo;
let longTapDuration = 1000; // time for the long tap
let widthForMobileSettings = 768; // width For Mobile Settings


/**
 * This function renders the tasks on board
 *
 */
async function renderBoardTasks() {
  await reloadTasksOnBoard();
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const allTasksSameCategory = tasks.filter((t) => t["category"] == category);
    const categoryTableColumn = document.getElementById(`${category}`);
    categoryTableColumn.innerHTML = '';
    document.getElementById(category).classList.remove('drag-area-highlight');
    if (allTasksSameCategory.length === 0) {
      categoryTableColumn.innerHTML = showNoTaskDiv();
    } else {
      showTasksForEachCategory(allTasksSameCategory, categoryTableColumn);
    }
  }
}


/**
 * This function show the "no tasks" div, when no todos could find in a category
 *
 */
function showNoTaskDiv() {
  return `<div class="drag-area-no-tasks d_f_c_c width-max">no tasks</div>`;
}


/**
 * This function checks, whether the tasks are empty.
 * If its true, the example tasks will load again
 * 
 */
async function reloadTasksOnBoard() {
  if (tasks.length === 0) {
    let div = document.getElementById("guestMessagePopupBoard");
    let messageText = document.getElementById("guestMessageBoard");
    showGuestPopupMessageForReload(div, messageText);
    await updateOrLoadData();
  }
}


/**
 * This function initiate all functions for generate the todos for each category
 * 
 * @param {string} allTasksSameCategory - the category name for the current category 
 * @param {string} categoryTableColumn - the category column container for the todos
 */
function showTasksForEachCategory(allTasksSameCategory, categoryTableColumn) {
  for (let k = 0; k < allTasksSameCategory.length; k++) {
    const task = allTasksSameCategory[k];
    categoryTableColumn.innerHTML += generateTodoHTML(task); // outsourced in renderHTML.js
    updateProgressBar(task);
    getContactsForTask(task);
    getPrioForTask(task);
  }
}


/**
 * This function initiate the guest message on board
 * 
 */
function showGuestMessageOnBoard() {
  if ((authorized === 'guest')) {
    let div = document.getElementById("guestMessagePopupBoard");
    let messageText = document.getElementById("guestMessageBoard");
    showGuestPopupMessage(div, messageText);
  }
}


/**
 * This function generates the current priority of the todo
 * 
 * @param {string} task - the current task
 */
function getPrioForTask(task) {
  let prioForTaskDiv = document.getElementById(`prioIn${task["id"]}`);
  prioForTaskDiv.innerHTML += `
    <img src="../assets/img/${getPriorityIcon(task)}" alt="">
    `;
}


/**
 * This function generates the current "assignedTo" contacts of the todo
 * 
 * @param {string} task - the current task
 */
function getContactsForTask(task) {
  let contactsForTaskDiv = document.getElementById(`contactsIn${task.id}`);
  contactsForTaskDiv.innerHTML = "";
  task.assignedTo.forEach((contactName, index) => {
    const backgroundColor = getBgColorTaskPopup(task, index);
    const letters = contactNamesLetters(contactName);
    const marginRightClass = task.assignedTo.length > 1 ? "mar-r--8" : "";
    contactsForTaskDiv.innerHTML += renderContactsForBoardTaskDiv(marginRightClass, backgroundColor, letters); // outsourced in renderHTML.js
  });
}


/**
 * This function generates the progressBar of the todo
 * 
 * @param {string} task - the current task
 */
function updateProgressBar(task) {
  let stubtasksOpenLength = task.subtasksOpen.length;
  let stubtasksDoneLength = task.subtasksDone.length;
  let allSubtasksByTask = stubtasksOpenLength + stubtasksDoneLength;
  let subtasksLengthDiv = document.getElementById(`subtasksLength${task["id"]}`);
  let stubtasksDoneLengthDiv = document.getElementById(`stubtasksDoneLength${task["id"]}`);
  let progressBar = document.getElementById(`progressBar${task["id"]}`);
  let percent = (stubtasksDoneLength / allSubtasksByTask) * 100;
  let result = percent.toFixed(2);
  subtasksLengthDiv.innerHTML = `${allSubtasksByTask}`;
  stubtasksDoneLengthDiv.innerHTML = `${stubtasksDoneLength}`;
  progressBar.style.width = `${result}%`;
  progressBar.classList.add("blue");
}


/**
 * This function starts the drag of the todo
 * 
 * @param {number} id - the current todo id
 */
function startDragging(id) {
  currentDraggedTaskId = id;
}


/**
 * This function moves the todo to the new category after drop
 * 
 * @param {string} currentCategory - the final category after dragging
 */
async function moveTo(currentCategory) {
  const currentDraggedTaskIdString = String(currentDraggedTaskId);
  let foundIndex;
  for (let id = 0; id < tasks.length; id++) {
    if (tasks[id].id === currentDraggedTaskIdString) {
      foundIndex = id;
      tasks[foundIndex].category = currentCategory;
      await saveNewUserDate();
      showGuestMessageOnBoard();
    }
  }
  await renderBoardTasks();
}


/**
 * This function allows the element only to drop at the final position
 * 
 * @param {string} event - the result of current position
 */
function allowDrop(event) {
  event.preventDefault();
}


/**
 * This function adds a class for highlighting the final category column
 * 
 * @param {number} id - the current todo id
 */
function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}


/**
 * This function removes the class for the highlighting the last category column
 * 
 * @param {number} id - the current todo id
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}


/********************** TODO POPUP OPENED **********************************/

/**
 * This function initiates the rendering of the todo when it is open
 * 
 * @param {number} openId - the id of the current todo
 */
async function openBoardTaskPopup(openId) {
  let boardTaskPopup = document.getElementById("boardTaskPopup");
  let container = document.getElementById("boardTaskPopupContainer");
  document.body.style.overflow = "hidden";
  boardTaskPopup.style.display = "flex";
  let openIdString = String(openId);
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === openIdString) {
      currentOpenTaskId = i;
    }
  }
  moveContainerIn(container);
  await renderBoardTaskPopupContent();
}


/**
 * This function contains the rendering functions for rendering the open todo
 * 
 */
async function renderBoardTaskPopupContent() {
  const todo = tasks[currentOpenTaskId];
  showTaskText(todo, currentOpenTaskId);
  getContactsForPopupTask(todo);
  await getSubtasksForPopupTask();
}

/**
 * This function contains the rendering for the entire text of the task
 *  
 * @param {string} todo - curent task
 */
function showTaskText(todo) {
  let openLabel = document.getElementById("taskPopupContentLabel");
  let openTitle = document.getElementById("taskPopupContentTitle");
  let openDescription = document.getElementById("taskPopupContentDescription");
  let openDueDate = document.getElementById("taskPopupContentDueDate");
  let openPriority = document.getElementById("taskPopupContentPriority");
  renderShowTaskContent(todo, openLabel, openTitle, openDescription, openDueDate, openPriority); // outsourced in renderHTML.js
}


/**
 * This function contains the rendering for the entire subtasks of the task
 *  
 */
async function getSubtasksForPopupTask() {
  let taskPopupContentSubtasks = document.getElementById("taskPopupContentSubtasks");
  await loadSubtasksByOpenTask();
  taskPopupContentSubtasks.innerHTML = "";
  getAllOpenSubtasks(taskPopupContentSubtasks);
  getAllDoneSubtasks(taskPopupContentSubtasks);
}


/**
 * This function loads the subtasks of the current task from the user or the guest
 * 
 */
async function loadSubtasksByOpenTask() {
  if ((authorized === 'user')) {
    subtasksOpen = users[currentUser].tasks[currentOpenTaskId].subtasksOpen;
    subtasksDone = users[currentUser].tasks[currentOpenTaskId].subtasksDone;
  } else {
    subtasksOpen = tasks[currentOpenTaskId].subtasksOpen;
    subtasksDone = tasks[currentOpenTaskId].subtasksDone;
  }
}


/**
 * This function renders all subtasks, which are not done
 *  
 * @param {string} taskPopupContentSubtasks - element.id for the text
 */
function getAllOpenSubtasks(taskPopupContentSubtasks) {
  for (let a = 0; a < subtasksOpen.length; a++) {
    taskPopupContentSubtasks.innerHTML += renderOpenSubtasks(a); // outsourced in renderHTML.js
  }
}


/**
 * This function renders all subtasks, which are already done
 *  
 * @param {string} taskPopupContentSubtasks - element.id for the text
 */
function getAllDoneSubtasks(taskPopupContentSubtasks) {
  for (let b = 0; b < subtasksDone.length; b++) {
    taskPopupContentSubtasks.innerHTML += renderDoneSubtasks(b); // outsourced in renderHTML.js
  }
}


/**
 * This function
 *  
 * @param {string} todo - curent task
 */
function getContactsForPopupTask(todo) {
  let taskPopupContentAssignedTo = document.getElementById("taskPopupContentAssignedTo");
  const contacts = todo["assignedTo"];
  taskPopupContentAssignedTo.innerHTML = '';
  for (let index = 0; index < contacts.length; index++) {
    const contact = contacts[index];
    const letters = contactNamesLetters(contact);
    const backgroundColor = getBgColorTaskPopup(todo, index);
    taskPopupContentAssignedTo.innerHTML += `
    <div class="d_f_fs_c gap-10 width-max">
    <div class="d_f_c_c contact-circle-small contact-circle-small-letters" style="background-color: ${backgroundColor};">${letters}</div>
    <p>${contact}</p>
    </div>
    `;
  }
}





async function clickSubtaskOpen(currentOpenTaskId, a) {
  let divSubtaskOpen = document.getElementById(
    `taskId${currentOpenTaskId}SubtaskOpenId${a}`
  );
  let clickedButton = "check-button-clicked.svg";
  divSubtaskOpen.innerHTML = `
    <img src="../assets/img/${clickedButton}" id="taskId${currentOpenTaskId}checkButtonDoneId${a}" onclick="clickSubtaskDone(${currentOpenTaskId}, ${a})"></img>
    `;
  if ((authorized === 'user')) {
    subtasksDone.push(subtasksOpen[a]);
    subtasksOpen.splice(a, 1);
    await saveNewUserDate();
    getSubtasksForPopupTask(currentOpenTaskId);
  } else {
    tasks[currentOpenTaskId].subtasksDone.push(subtasksOpen[a]);
    tasks[currentOpenTaskId].subtasksOpen.splice(a, 1);
    getSubtasksForPopupTask(currentOpenTaskId);
  }
}


async function clickSubtaskDone(currentOpenTaskId, b) {
  let divSubtaskDone = document.getElementById(
    `taskId${currentOpenTaskId}SubtaskDoneId${b}`
  );
  let emptyButton = "check-button-empty.svg";
  divSubtaskDone.innerHTML = `
    <img src="../assets/img/${emptyButton}" id="taskId${currentOpenTaskId}checkButtonOpenId${b}" onclick="clickSubtaskOpen(${currentOpenTaskId}, ${b})"></img>
    `;
  if ((authorized === 'user')) {
    subtasksOpen.push(subtasksDone[b]);
    subtasksDone.splice(b, 1);
    await saveNewUserDate();
    getSubtasksForPopupTask(currentOpenTaskId);
  } else {
    tasks[currentOpenTaskId].subtasksOpen.push(subtasksDone[b]);
    tasks[currentOpenTaskId].subtasksDone.splice(b, 1);
    getSubtasksForPopupTask(currentOpenTaskId);
  }
}




function getBgColorTaskPopup(task, index) {
  const contactName = task.assignedTo[index];
  let contactInfo;
  if (authorized === 'user') {
    contactInfo = users[currentUser].contacts.find(contact => contact.name === contactName);
  } else {
    contactInfo = contacts.find(contact => contact.name === contactName);
  }
  if (!contactInfo || !contactInfo.color) {
    return "blue";  // Standardfarbe, wenn keine Farbe gefunden wurde
  }
  return contactInfo.color;
}





async function editTask() {
  let boardTaskShowContainer = document.getElementById("boardTaskShowContainer");
  let boardTaskEditContainer = document.getElementById("boardTaskEditContainer");
  let btnDivOk = document.getElementById("btnDivOk-3");
  btnDivOk.style.display = "flex";
  boardTaskEditContainer.style.display = 'flex';
  boardTaskShowContainer.style.display = 'none';

  let addTaskFormContainer = document.getElementById('addTaskFormContainer-3');
  let addTaskPartingline = document.getElementById('addTaskPartingline-3');
  let bottomAddTaskOptions = document.getElementById('bottomAddTaskOptions-3');
  let bottomAddTaskEditOptions = document.getElementById('bottomAddTaskEditOptions-3');
  let addTaskCategory = document.getElementById('addTaskCategory-3');
  let taskTitle = document.getElementById('taskTitle-3');
  let taskDescription = document.getElementById('taskDescription-3');
  let taskDate = document.getElementById('taskDate-3');
  let urgentBtn = document.getElementById('urgentBtn-3');
  let mediumBtn = document.getElementById('mediumBtn-3');
  let lowBtn = document.getElementById('lowBtn-3');

  let box = document.querySelectorAll('.box');
  box.forEach(function (boxReplace) {
    boxReplace.classList.replace('box', 'box-edit');
  });

  addTaskCategory.style.display = 'none';
  bottomAddTaskOptions.style.display = 'none';
  bottomAddTaskEditOptions.style.display = 'flex';
  addTaskFormContainer.style.flexFlow = 'column';
  addTaskPartingline.style.display = 'none';

  taskTitle.value = tasks[currentOpenTaskId].title;
  taskDescription.value = tasks[currentOpenTaskId].description;
  const todo = tasks[currentOpenTaskId];
  getContactsForPopupTask(todo);
  taskDate.value = tasks[currentOpenTaskId].dueDate;

  let prio = tasks[currentOpenTaskId].priority;
  let prioBtn;
  if (prio === 'Urgent') {
    prioBtn = urgentBtn;
  } else if (prio === 'Medium') {
    prioBtn = mediumBtn;
  } else if (prio === 'Low') {
    prioBtn = lowBtn;
  }

  prioBtn.click();
  checkedCheckboxes = todo.assignedTo;
  let taskContactDiv = document.getElementById("taskContactDiv-3");
  taskContactDiv.style.display = "none";
  showContactSelection();
  renderSubtasksPopup();
}


function renderSubtasksPopup() {
  let subtaskDivAddTask = document.getElementById(`subtaskDivAddTask-${templateIndex}`);

  subtaskDivAddTask.innerHTML = ``;

  subtasksOpen.forEach((subtask, index) => {
    subtaskDivAddTask.innerHTML += `
  <div id='subtask${index}' class='d_f_sb_c pad-x-10 subtask'>
  <span>• ${subtask}</span>
  <div class='d_f_c_c gap-5'>
    <img src="assets/img/pen_dark.svg" alt="pen" class="subtask-icon" id="subtasksOpen${index}" onclick="editSubtask(this)" />
    <div class="subtask-partingline"></div>
    <img src="assets/img/trash_dark.svg" alt="trash" class="subtask-icon" id="subtasksOpen${index}" onclick="deleteSubtask(this)" />
  </div>
</div>
  `;
  });

  subtasksDone.forEach((subtask, index) => {
    subtaskDivAddTask.innerHTML += `
  <div id='subtask${index}' class='d_f_sb_c pad-x-10 subtask'>
  <span>• ${subtask}</span>
  <div class='d_f_c_c gap-5'>
    <img src="assets/img/pen_dark.svg" alt="pen" class="subtask-icon" id="subtasksDone${index}" onclick="editSubtask(this)" />
    <div class="subtask-partingline"></div>
    <img src="assets/img/trash_dark.svg" alt="trash" class="subtask-icon" id="subtasksDone${index}" onclick="deleteSubtask(this)"/>
  </div>
</div>
  `;
  });
}


async function deleteTask() {
  document.getElementById("boardTaskPopup").style.display = "none";
  document.body.style.overflow = "scroll";
  tasks.splice(currentOpenTaskId, 1);
  showGuestMessageOnBoard();
  if ((authorized === 'user')) {
    await saveNewUserDate();
  }
  await renderBoardTasks();
}


function closeBoardTaskPopup() {
  checkedCheckboxes = [];
  let boardTaskEditContainer = document.getElementById("boardTaskEditContainer");
  let boardTaskShowContainer = document.getElementById("boardTaskShowContainer");
  boardTaskEditContainer.style.display = 'none';
  boardTaskShowContainer.style.display = 'flex';
  let popup = document.getElementById("boardTaskPopup");
  let container = document.getElementById("boardTaskPopupContainer");
  moveContainerOut(container);
  setTimeout(function () {
    displayNonePopup(popup);
    renderBoardTasks();
    showGuestMessageOnBoard();
  }, 500);
  document.body.style.overflow = "scroll";
}

function changeImage(element, src) {
  element.querySelector(".delete").src = src;
}


function restoreImagePopupTask(element, defaultSrc) {
  element.querySelector(".delete").src = defaultSrc;
}


function showSubtasksByHovering(element) {
  let statusText = document.getElementById(`statusText${element}`);
  statusText.style.display = 'block';
  statusText.onmouseout = function () {
    statusText.style.display = 'none';
  };
}


/********************** ADD-TASK POPUP OPENED **********************************/

/**
 * this functions initiate all functions for the popup add-task
 *
 */
function openBoardAddTaskPopup(element) {
  clearForm();
  document.getElementById(`bottomAddTaskEditOptions-4`).style.display = 'none';
  if (element.id.includes('Progress')) {
    setCategory = 'inProgress';
  } else if (element.id.includes('AwaitFeedback')) {
    setCategory = 'awaitFeedback';
  }
  changeTemplateIndex();
  renderAddTaskFormButton();
  let boardAddTaskPopup = document.getElementById("boardAddTaskPopup");
  let container = document.getElementById("boardAddTaskPopupContainer");
  boardAddTaskPopup.style.display = "flex";
  document.body.style.overflow = "hidden";
  moveContainerIn(container);
}


function closeBoardAddTaskPopup() {
  clearForm();
  checkedCheckboxes = [];
  let popup = document.getElementById("boardAddTaskPopup");
  let container = document.getElementById("boardAddTaskPopupContainer");
  moveContainerOut(container);
  setTimeout(function () {
    displayNonePopup(popup);
    renderBoardTasks();
    showGuestMessageOnBoard();
  }, 500);
  document.body.style.overflow = "scroll";
  templateIndex = 3;
}

/*********************** END ADD TASK POPUP OPENED ********************************/


/********************** SEARCH FUNCTION **********************************/

let findMatchingIndices = [];

/**
 * this function initiate all search functions
 *
 */
async function searchTasksOnBoard() {
  let searchInput = document.getElementById("searchBoardInput").value;
  let search = searchInput.trim().toLowerCase();
  let matchingIndices = []; // array for search matches
  await setQueryForSearch(matchingIndices, search);
  displaySearchMessage(matchingIndices);
  await generateCategoriesBySearch(matchingIndices);
  resetSearch();
}


function displaySearchMessage(matchingIndices) {
  let resultMessageDiv = document.getElementById("resultMessageDiv");
  resultMessageDiv.style.display = "flex";
  if (matchingIndices.length === 0) {
    resultMessageDiv.innerHTML = `<div>there were no results for your search</div> <div>|</div> <div class="search-back-link" onclick="renderAfterSearch()"><a class="link-style">go back</a></div>`;
  } else if (matchingIndices.length === 1) {
    resultMessageDiv.innerHTML = `<div>${matchingIndices.length} match found</div> <div>|</div> <div class="search-back-link" onclick="renderAfterSearch()"><a class="link-style">go back</a></div>`;
  } else {
    resultMessageDiv.innerHTML = `<div>${matchingIndices.length} matches found</div> <div>|</div> <div class="search-back-link" onclick="renderAfterSearch()"><a class="link-style">go back</a></div>`;
  }
}


async function renderAfterSearch() {
  let resultMessageDiv = document.getElementById("resultMessageDiv");
  resultMessageDiv.style.display = "none";
  await renderBoardTasks();
}


/**
 * this function includes search querys whehter a search is allowed or not, here only one query set
 *
 */
async function setQueryForSearch(matchingIndices, search) {
  if (search.length >= 2) {
    await findTasksIndices(matchingIndices, search);
  }
}


/**
 * this function iterates all tasks, whether the task description or task name includes the search result
 * the result tasks are pushed in the array after matching
 *
 */
async function findTasksIndices(matchingIndices, search) {
  for (let i = 0; i < tasks.length; i++) {
    const everySearchedTaskName = tasks[i].title;
    const everySearchedTaskDecription = tasks[i].description;
    if (
      everySearchedTaskName.toLowerCase().includes(search) ||
      everySearchedTaskDecription.toLowerCase().includes(search)
    ) {
      matchingIndices.push(tasks[i]);
    }
  }
}


/**
 * this function creates all categegories and the corresponding tasks with the parameter "allTasksSameCategory"
 *
 */
async function generateCategoriesBySearch(matchingIndices) {
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const allTasksSameCategory = matchingIndices.filter(
      (t) => t["category"] == category
    );
    const categoryTableColumn = document.getElementById(`${category}`);
    categoryTableColumn.innerHTML = '';
    if (allTasksSameCategory.length === 0) {
      categoryTableColumn.innerHTML = `<div class="drag-area-no-tasks d_f_c_c width-max">no tasks</div>`;
    } else {
      showTasksForEachCategory(allTasksSameCategory, categoryTableColumn);
    }
  }
}


/**
 * after the search results are displayed, the search input field is reset
 *
 */
function resetSearch() {
  document.getElementById("searchBoardInput").value = '';
}


/**
 * the search function should also start, when the key-button "enter" is pressed
 *
 */
function searchTasksByKeyPress(event) {
  if (event.key === "Enter") {
    searchTasksOnBoard();
  }
}


/*********************** END SEARCH FUNCTION ********************************/


/*********************** START MOBILE TODOS ********************************/

function startTimer(taskId) {
  if (window.innerWidth <= widthForMobileSettings) {
    timerMobileTodo = setTimeout(function () {
      mobilePopupFilterTodoSettings.style.display = 'flex';
      let mobileTodoSettings = document.getElementById('mobilePopupContentTodoSettings');
      mobileTodoSettings.innerHTML = renderMobileTodoSettings(taskId);
      getMobileCurrentOpenTaskId(taskId);
    }, longTapDuration);
  }
}

function getMobileCurrentOpenTaskId(taskId) {
  let indexTodoForMobile = -1;
  for (let i = 0; i < tasks.length; i++) {
    const searchId = parseInt(tasks[i].id, 10);
    if (searchId === taskId) {
      indexTodoForMobile = i;
      break;
    }
  }

  if (indexTodoForMobile !== -1) {
    currentOpenTaskId = indexTodoForMobile;
  }
}

function clearTimer() {
  clearTimeout(timerMobileTodo);
}


function mobileTodoMove() {
  mobileTodoSettingsCategoryMenu.style.display = 'flex';
  let categoriesMenu = document.getElementById('mobileTodoSettingsCategories');
  categoriesMenu.innerHTML = '';
  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];
    categoriesMenu.innerHTML += renderMobileCategories(category);
  }
}

async function mobileMoveToCategory(element) {
  if (element.id.includes('backlog')) {
    tasks[currentOpenTaskId].category = 'backlog';
  }
  if (element.id.includes('inProgress')) {
    tasks[currentOpenTaskId].category = 'inProgress';
  }
  if (element.id.includes('awaitFeedback')) {
    tasks[currentOpenTaskId].category = 'awaitFeedback';
  }
  if (element.id.includes('done')) {
    tasks[currentOpenTaskId].category = 'done';
  }
  resetMobileTodoSettings();
  await renderBoardTasks();

  if ((authorized === 'user')) {
    await saveNewUserDate();
  } else {
    let div = document.getElementById("guestMessagePopupBoard");
    let messageText = document.getElementById("guestMessageBoard");
    showGuestPopupMessage(div, messageText);
  }
}

function mobileTodoEdit(taskId) {
  resetMobileTodoSettings();
  openBoardTaskPopup(taskId);
  editTask();
}

async function mobileTodoDelete() {
  await deleteTask();
  resetMobileTodoSettings();
}


function resetMobileTodoSettings() {
  mobilePopupFilterTodoSettings.style.display = 'none';
}

/*********************** END MOBILE TODOS ********************************/
