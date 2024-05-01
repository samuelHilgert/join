let categories = ["backlog", "inProgress", "awaitFeedback", "done"];
let currentDraggedTaskId;
let currentOpenTaskId;
let taskId;
let subtasksOpen = [];
let subtasksDone = [];

/**
 *
 *
 */
async function renderBoardTasks() {
  hideSearchMessage();

  if (tasks.length === 0) {
    let div = document.getElementById("guestMessagePopupBoard");
    let messageText = document.getElementById("guestMessageBoard");
    showGuestPopupMessageForReload(div, messageText);
    await updateOrLoadData();
  }

  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const allTasksSameCategory = tasks.filter((t) => t["category"] == category);
    const categoryTableColumn = document.getElementById(`${category}`);
    categoryTableColumn.innerHTML = '';
    document.getElementById(category).classList.remove('drag-area-highlight');
    if (allTasksSameCategory.length === 0) {
      categoryTableColumn.innerHTML = `<div class="drag-area-no-tasks d_f_c_c width-max">no tasks</div>`;
    } else {
      showTasksForEachCategory(allTasksSameCategory, categoryTableColumn);
    }
  }
}

function showTasksForEachCategory(allTasksSameCategory, categoryTableColumn) {
  for (let k = 0; k < allTasksSameCategory.length; k++) {
    const task = allTasksSameCategory[k];


    categoryTableColumn.innerHTML += generateTodoHTML(task);

    updateProgressBar(task);
    getContactsForTask(task);
    getPrioForTask(task);
  }
}

/********************** GENERAL FUNCTIONS **********************************/

function showGuestMessageOnBoard() {
  if ((authorized === 'guest'))  {
    let div = document.getElementById("guestMessagePopupBoard");
    let messageText = document.getElementById("guestMessageBoard");
    showGuestPopupMessage(div, messageText);
  }
}

/*********************** END GENERAL FUNCTIONS ********************************/

function generateTodoHTML(task) {
  return `<div class="todo d_c_fs_fs gap-10 width-max" onclick="openBoardTaskPopup(${task["id"]})" draggable="true" ondragstart="startDragging(${task["id"]})">
            <div class="btn-board d_f_fs_fs" id="">${task["label"]}</div>
            <h6><b>${task["title"]}</b></h6>
            <p>${task["description"]}</p>
            <div class="d_f_c_c width-max">
                <div class="progress">
                    <div class="progress-bar" id="progressBar${task["id"]}"></div>
                </div>
                <div class="statusText"><span id="stubtasksDoneLength${task["id"]}">X</span>/<span id="subtasksLength${task["id"]}">XX</span><span>&nbsp;Subtasks</span></div>
            </div>
            <div class="d_f_sb_c width-max">
            <div class="d_f_c_c" id="contactsIn${task["id"]}">
            </div>
            <div id="prioIn${task["id"]}"></div>
            </div>`;
}

function getPrioForTask(task) {
  let prioForTaskDiv = document.getElementById(`prioIn${task["id"]}`);
  prioForTaskDiv.innerHTML += `
    <img src="../assets/img/${getPriorityIcon(task)}" alt="">
    `;
}

function getContactsForTask(task) {
  let contactsForTaskDiv = document.getElementById(`contactsIn${task["id"]}`);
  const contacts = task["assignedTo"];
  contactsForTaskDiv.innerHTML = "";
  for (let c = 0; c < contacts.length; c++) {
    const contact = contacts[c];
    const letters = contactNamesLetters(contact);
    const backgroundColor = getBgColorTaskPopup(c);
    contactsForTaskDiv.innerHTML += `
    <div class="d_f_fs_c gap-10 width-max">
    <div class="d_f_c_c contact-circle-small contact-circle-small-letters" style="background-color: ${backgroundColor};">${letters}</div>
    </div>
    `;
  }
}

function updateProgressBar(task) {
  let stubtasksOpenLength = task.subtasksOpen.length;
  let stubtasksDoneLength = task.subtasksDone.length;
  let allSubtasksByTask = stubtasksOpenLength + stubtasksDoneLength;

  let subtasksLengthDiv = document.getElementById(
    `subtasksLength${task["id"]}`
  );
  subtasksLengthDiv.innerHTML = `${allSubtasksByTask}`;

  let stubtasksDoneLengthDiv = document.getElementById(
    `stubtasksDoneLength${task["id"]}`
  );
  stubtasksDoneLengthDiv.innerHTML = `${stubtasksDoneLength}`;

  // progessBar
  let progressBar = document.getElementById(`progressBar${task["id"]}`);
  let percent = (stubtasksDoneLength / allSubtasksByTask) * 100;
  let result = percent.toFixed(2);
  progressBar.style.width = `${result}%`;
  progressBar.classList.add("blue");
}

function startDragging(id) {
  currentDraggedTaskId = id;
}

async function moveTo(currentCategory) {
  const currentDraggedTaskIdString = String(currentDraggedTaskId);
  let foundIndex;
  for (let id = 0; id < tasks.length; id++) {
    if (tasks[id].id === currentDraggedTaskIdString) {
      foundIndex = id;
      tasks[foundIndex].category = currentCategory;
      if ((authorized === 'user'))  {
        await saveNewUserDate();
      } else {
        let div = document.getElementById("guestMessagePopupBoard");
        let messageText = document.getElementById("guestMessageBoard");
        showGuestPopupMessage(div, messageText);
      }
    }
  }
  await renderBoardTasks();
}

function allowDrop(event) {
  event.preventDefault();
}

function highlight(id) {
  document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove('drag-area-highlight');
}

function doNotClose(event) {
  event.stopPropagation();
}

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
  await renderBoardTaskPopupContent(currentOpenTaskId);
}

async function renderBoardTaskPopupContent(currentOpenTaskId) {
  const todo = tasks[currentOpenTaskId];
  showTaskText(todo, currentOpenTaskId);
  getContactsForPopupTask(todo);
  await getSubtasksForPopupTask(currentOpenTaskId);
}

function showTaskText(todo) {
  let taskPopupContentLabel = document.getElementById("taskPopupContentLabel");
  let taskPopupContentTitle = document.getElementById("taskPopupContentTitle");
  let taskPopupContentDescription = document.getElementById(
    "taskPopupContentDescription"
  );
  let taskPopupContentDueDate = document.getElementById(
    "taskPopupContentDueDate"
  );
  let taskPopupContentPriority = document.getElementById(
    "taskPopupContentPriority"
  );
  taskPopupContentLabel.innerHTML = `${todo["label"]}`;
  taskPopupContentTitle.innerHTML = `<h2><b>${todo["title"]}</b></h2>`;
  taskPopupContentDescription.innerHTML = `<p>${todo["description"]}</p>`;
  taskPopupContentDueDate.innerHTML = `
    <div class="d_f_fs_c width-20 gap-30">
        <p>Due date:</p>
    </div>
    <div class="d_f_fs_c gap-30">
        <p>${todo["dueDate"]}</p>
    </div>
    `;
  taskPopupContentPriority.innerHTML = `
    <div class="d_f_fs_c width-20 gap-30">
        <p>Priority:</p>
    </div>
    <div class="d_f_fs_c gap-10">
        <p>${todo["priority"]}</p>
        <div><img src="../assets/img/${getPriorityIcon(todo)}"></img></div>
    </div>
    `;
}

async function getSubtasksForPopupTask(currentOpenTaskId) {
  let taskPopupContentSubtasks = document.getElementById(
    "taskPopupContentSubtasks"
  );
  await loadSubtasksByOpenTask();
  taskPopupContentSubtasks.innerHTML = "";
  // rendering subtasksOpen with empty check-button
  for (let a = 0; a < subtasksOpen.length; a++) {
    taskPopupContentSubtasks.innerHTML += `
            <div class="d_f_c_c gap-10">
            <div id="taskId${currentOpenTaskId}SubtaskOpenId${a}"><img src="../assets/img/check-button-empty.svg" onclick="clickSubtaskOpen(${currentOpenTaskId}, ${a})"></img></div>
            <p>${subtasksOpen[a]}</p>
            </div>
            `;
  }
  // rendering subtasksDone with clicked check-button
  for (let b = 0; b < subtasksDone.length; b++) {
    taskPopupContentSubtasks.innerHTML += `
            <div class="d_f_c_c gap-10">
            <div id="taskId${currentOpenTaskId}SubtaskDoneId${b}"><img src="../assets/img/check-button-clicked.svg" onclick="clickSubtaskDone(${currentOpenTaskId}, ${b})"></img></div>
            <p>${subtasksDone[b]}</p>
            </div>
            `;
  }
}

async function loadSubtasksByOpenTask() {
  if ((authorized === 'user'))  {
    subtasksOpen = users[currentUser].tasks[currentOpenTaskId].subtasksOpen;
    subtasksDone = users[currentUser].tasks[currentOpenTaskId].subtasksDone;
  } else {
    subtasksOpen = tasks[currentOpenTaskId].subtasksOpen;
    subtasksDone = tasks[currentOpenTaskId].subtasksDone;
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

function getContactsForPopupTask(todo) {
  let taskPopupContentAssignedTo = document.getElementById(
    "taskPopupContentAssignedTo"
  );
  const contacts = todo["assignedTo"];
  taskPopupContentAssignedTo.innerHTML = "";
  for (let index = 0; index < contacts.length; index++) {
    const contact = contacts[index];
    const letters = contactNamesLetters(contact);
    const backgroundColor = getBgColorTaskPopup(index);
    taskPopupContentAssignedTo.innerHTML += `
    <div class="d_f_fs_c gap-10 width-max">
    <div class="d_f_c_c contact-circle-small contact-circle-small-letters" style="background-color: ${backgroundColor};">${letters}</div>
    <p>${contact}</p>
    </div>
    `;
  }
}

function getPriorityIcon(todo) {
  let imgSrc;
  if (todo["priority"] === "Urgent") {
    imgSrc = "prio-urgent.svg";
  } else if (todo["priority"] === "Medium") {
    imgSrc = "prio-media.svg";
  } else if (todo["priority"] === "Low") {
    imgSrc = "prio-low.svg";
  }
  return imgSrc;
}

function getBgColorTaskPopup(index) {
  let userContact;
  if ((authorized === 'guest'))  {
    userContact = contacts[index];
  } else {
    userContact = users[currentUser]["contacts"][index];
  }
  return userContact.color;
}

async function editTask() {
  let taskPopupContentTitle = document.getElementById("taskPopupContentTitle");
  let taskPopupContentDescription = document.getElementById(
    "taskPopupContentDescription"
  );
  let taskPopupContentDueDate = document.getElementById(
    "taskPopupContentDueDate"
  );
  let taskPopupContentPriority = document.getElementById(
    "taskPopupContentPriority"
  );
  let taskPopupContentAssignedTo = document.getElementById(
    "taskPopupContentAssignedTo"
  );
  let taskPopupContentSubtasks = document.getElementById(
    "taskPopupContentSubtasks"
  );
  document.getElementById("taskPopupContentLabel").style.display = "none";
  taskPopupContentTitle.innerHTML = `<p>Title</p><input>`;
  taskPopupContentDescription.innerHTML = `<p>Description</p><input>`;
  taskPopupContentDueDate.style.flexDirection = "column";
  taskPopupContentDueDate.style.alignItems = "flex-start";
  taskPopupContentDueDate.innerHTML = `<p>Due Date</p><input>`;
  taskPopupContentPriority.innerHTML = `<p>Priority</p><input>`;
  taskPopupContentPriority.style.flexDirection = "column";
  taskPopupContentPriority.style.alignItems = "flex-start";
  taskPopupContentAssignedTo.innerHTML = `
    <input>
    <p>Max Mustermann</p>
    <p>Thorsten Haas</p>
    <p>Uwe Schmidt</p>
    `;
  taskPopupContentSubtasks.innerHTML = `
    <input>
    <p>Start Page Layout</p>
    <p>Implement Recipe</p>
    `;
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

/********************** ADD-TASK POPUP OPENED **********************************/

/**
 * this functions initiate all functions for the popup add-task
 *
 */
function openBoardAddTaskPopup() {
  let boardAddTaskPopup = document.getElementById("boardAddTaskPopup");
  let container = document.getElementById("boardAddTaskPopupContainer");
  boardAddTaskPopup.style.display = "flex";
  document.body.style.overflow = "hidden";
  moveContainerIn(container);
}

function closeBoardAddTaskPopup() {
  let popup = document.getElementById("boardAddTaskPopup");
  let container = document.getElementById("boardAddTaskPopupContainer");
  moveContainerOut(container);
  setTimeout(function () {
    displayNonePopup(popup);
    renderBoardTasks();
    showGuestMessageOnBoard();
  }, 500);
  document.body.style.overflow = "scroll";
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
  await renderBoardTasks();
}

function hideSearchMessage() {
  let resultMessageDiv = document.getElementById("resultMessageDiv");
  resultMessageDiv.style.display = "none";
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

function changeImage(element, src) {
  element.querySelector(".delete").src = src;
}

function restoreImagePopupTask(element, defaultSrc) {
  element.querySelector(".delete").src = defaultSrc;
}
