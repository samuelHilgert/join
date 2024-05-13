let categories = ["backlog", "inProgress", "awaitFeedback", "done"];
let currentDraggedTaskId;
let currentOpenTaskId;
let taskId;
let subtasksOpen = [];
let subtasksDone = [];
let longTapDuration = 1000; // time for the long tap
let widthForMobileSettings = 430; // width For Mobile Settings


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
 * This function displays the subtasks satus text under the progressbar by hovering
 * 
 * @param {string} element - the id of the current todo
 */
function showSubtasksByHovering(element) {
  let statusText = document.getElementById(`statusText${element}`);
  statusText.style.display = 'block';
  statusText.onmouseout = function () {
    statusText.style.display = 'none';
  };
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
      await saveNewUserDate();  // outsourced in script.js
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


////////////////////// TODO OPENED POPUP ////////////////////// 


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
 * This function gets the "assignedTo" contacts and initiate the rendering of these 
 *  
 * @param {string} todo - curent task
 */
function getContactsForPopupTask(todo) {
  let taskPopupContentAssignedTo = document.getElementById("taskPopupContentAssignedTo");
  const contacts = todo["assignedTo"];
  taskPopupContentAssignedTo.innerHTML = '';
  for (let index = 0; index < contacts.length; index++) {
    const contact = contacts[index];
    const letters = contactNamesLetters(contact); // outsourced in script.js
    const backgroundColor = getBgColorTaskPopup(todo, index); // outsourced in script.js
    taskPopupContentAssignedTo.innerHTML += renderAssignedToContactsForOpenTask(contact, letters, backgroundColor); // outsourced in renderHTML.js
  }
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
 * This function switches the subtask status between open and done
 *  
 * @param {number} pos - index of the current subtask
 */
async function clickSubtaskToSwitch(pos, element) {
  let clickedButton = "check-button-clicked.svg";
  let emptyButton = "check-button-empty.svg";
  if (element.id.includes('Open')) {
    element.innerHTML = `<img src="../assets/img/${clickedButton}">`;
    await saveSwitchedToDoneSubtasks(pos);
  } else {
    element.innerHTML = `<img src="../assets/img/${emptyButton}">`;
    await saveSwitchedToOpenSubtasks(pos);
  }
  getSubtasksForPopupTask();
}


/**
 * This function removes the current subtask from the "open" subtasks array and moves it to the "done" subtasks array.
 * If the user is registered, the data is stored remotely
 * 
 * @param {number} pos - index of the current subtask
 */
async function saveSwitchedToDoneSubtasks(pos) {
  if ((authorized === 'user')) {
    subtasksDone.push(subtasksOpen[pos]);
    subtasksOpen.splice(pos, 1);
    await saveNewUserDate();  // outsourced in script.js
  } else {
    tasks[currentOpenTaskId].subtasksDone.push(subtasksOpen[pos]);
    tasks[currentOpenTaskId].subtasksOpen.splice(pos, 1);
  }
}


/**
 * This function removes the current subtask from the "done" ubtasks array and moves it to the "open" subtasks array.
 * If the user is registered, the data is stored remotely
 * 
 * @param {number} pos - index of the current subtask
 */
async function saveSwitchedToOpenSubtasks(pos) {
  if ((authorized === 'user')) {
    subtasksOpen.push(subtasksDone[pos]);
    subtasksDone.splice(pos, 1);
    await saveNewUserDate();  // outsourced in script.js
  } else {
    tasks[currentOpenTaskId].subtasksOpen.push(subtasksDone[pos]);
    tasks[currentOpenTaskId].subtasksDone.splice(pos, 1);
  }
}


/**
 * This function closes the opened task
 * 
 */
function closeBoardTaskPopup() {
  resetAfterClosingOpenedTask();
  let popup = document.getElementById("boardTaskPopup");
  let container = document.getElementById("boardTaskPopupContainer");
  moveContainerOut(container);
  setTimeout(function () {
    displayNonePopup(popup);
    renderBoardTasks();
    showGuestMessageOnBoard();
  }, 500);
}


/**
 * This function resets the default values ​​after closing the open task
 * 
 */
function resetAfterClosingOpenedTask() {
  checkedCheckboxes = [];
  let boardTaskEditContainer = document.getElementById("boardTaskEditContainer");
  let boardTaskShowContainer = document.getElementById("boardTaskShowContainer");
  boardTaskEditContainer.style.display = 'none';
  boardTaskShowContainer.style.display = 'flex';
  document.body.style.overflow = "scroll";
}


////////////////////// END TODO OPENED POPUP ////////////////////// 


/////////////////////////// EDIT TASK ///////////////////////////// 


/**
 * This function initiate the style and rendering for the edit task form
 * 
 */
async function editTask() {
  let boardTaskShowContainer = document.getElementById("boardTaskShowContainer");
  let boardTaskEditContainer = document.getElementById("boardTaskEditContainer");
  boardTaskEditContainer.style.display = 'flex';
  boardTaskShowContainer.style.display = 'none';
  hideAndDisplayElementsForEdit();
  changeFormStyle();
  renderTextForEdit();
  getCurrentPriorityBtn();
  const todo = tasks[currentOpenTaskId];
  getContactsForPopupTask(todo); // already used for todo opened popup
  checkedCheckboxes = todo.assignedTo; // global variable in add-task.js
  showContactSelection(); // outsourced in add-task.js
  renderSubtasksPopup();
}


/**
 * This function hides and displays the elements for a different style than the normal add task form
 * 
 */
function hideAndDisplayElementsForEdit() {
  let btnDivOk = document.getElementById("btnDivOk-3");
  let addTaskCategory = document.getElementById('addTaskCategory-3');
  let bottomAddTaskOptions = document.getElementById('bottomAddTaskOptions-3');
  let bottomAddTaskEditOptions = document.getElementById('bottomAddTaskEditOptions-3');
  let addTaskPartingline = document.getElementById('addTaskPartingline-3');
  let taskContactDiv = document.getElementById("taskContactDiv-3");
  taskContactDiv.style.display = "none";
  bottomAddTaskEditOptions.style.display = 'flex';
  bottomAddTaskOptions.style.display = 'none';
  addTaskCategory.style.display = 'none';
  addTaskPartingline.style.display = 'none';
  btnDivOk.style.display = "flex";
}


/**
 * This function changes the style of the form for a different style than the normal add task form
 * 
 */
function changeFormStyle() {
  let addTaskFormContainer = document.getElementById('addTaskFormContainer-3');
  let box = document.querySelectorAll('.box');
  addTaskFormContainer.style.flexFlow = 'column';
  box.forEach(function (boxReplace) {
    boxReplace.classList.replace('box', 'box-edit');
  });
}


/**
 * This function displays the saved title, description and label
 * 
 */
function renderTextForEdit() {
  let taskTitle = document.getElementById('taskTitle-3');
  let taskDescription = document.getElementById('taskDescription-3');
  let taskDate = document.getElementById('taskDate-3');
  taskTitle.value = tasks[currentOpenTaskId].title;
  taskDescription.value = tasks[currentOpenTaskId].description;
  taskDate.value = tasks[currentOpenTaskId].dueDate;
}


/**
 * This function displays the saved category as a button
 * 
 */
function getCurrentPriorityBtn() {
  let urgentBtn = document.getElementById('urgentBtn-3');
  let mediumBtn = document.getElementById('mediumBtn-3');
  let lowBtn = document.getElementById('lowBtn-3');
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
}


/**
 * This function renders the subtasks in the edit form
 * 
 */
function renderSubtasksPopup() {
  let subtaskDivAddTask = document.getElementById(`subtaskDivAddTask-${templateIndex}`);
  subtaskDivAddTask.innerHTML = ``;
  subtasksOpen.forEach((subtask, index) => {
    subtaskDivAddTask.innerHTML += renderOpenSubtasksInEditForm(subtask, index); // outsourced in renderHTML.js
  });
  subtasksDone.forEach((subtask, index) => {
    subtaskDivAddTask.innerHTML += renderDoneSubtasksInEditForm(subtask, index); // outsourced in renderHTML.js
  });
}


/////////////////////////// END EDIT TASK ///////////////////////////// 


/////////////////////////// MORE OPTIONS FOR TODOS ///////////////////////////// 


/**
 * This functions deletes the current todo from board 
 * 
 */
async function deleteTask() {
  document.getElementById("boardTaskPopup").style.display = "none";
  document.body.style.overflow = "scroll";
  tasks.splice(currentOpenTaskId, 1);
  showGuestMessageOnBoard();
  await saveNewUserDate(); // outsourced in script.js
  await renderBoardTasks();
}


/////////////////////////// END MORE OPTIONS FOR TODOS ///////////////////////////// 


///////////////////////////////// ADD-TASK POPUP /////////////////////////////////// 


/**
 * This functions initiate all functions for the popup add-task form on board.html
 * 
 * @param {string} element - the div-element of the clicked add-task-button
 */
function openBoardAddTaskPopup(element) {
  clearForm(); // outsourced in add-task.js
  document.getElementById(`bottomAddTaskEditOptions-4`).style.display = 'none';
  changeTodoCategoryByColumn(element);
  changeTemplateIndex(); // outsourced in add-task.js
  renderAddTaskFormButton(); // outsourced in renderHTML.js
  let boardAddTaskPopup = document.getElementById("boardAddTaskPopup");
  let container = document.getElementById("boardAddTaskPopupContainer");
  boardAddTaskPopup.style.display = "flex";
  document.body.style.overflow = "hidden";
  moveContainerIn(container); // outsourced in script.js
}


/**
 * This functions changes the category after clicking the Add Task button from the category
 * 
 * @param {string} element - the div-element of the clicked add-task-button
 */
function changeTodoCategoryByColumn(element) {
  if (element.id.includes('Progress')) {
    setCategory = 'inProgress';
  } else if (element.id.includes('AwaitFeedback')) {
    setCategory = 'awaitFeedback';
  }
}


/**
 * This functions closes the popup add-task form
 * 
 */
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


//////////////////////////////// END ADD-TASK POPUP ////////////////////////////////


///////////////////////////////// SEARCH FUNCTION //////////////////////////////////


/**
 * This function initiate all search functions
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


/**
 * This function includes search querys whehter a search is allowed or not, here only one query set
 *
 * @param {string} matchingIndices - array for search matches
 * @param {string} search - search input.value
 */
async function setQueryForSearch(matchingIndices, search) {
  if (search.length >= 2) {
    await findTasksIndices(matchingIndices, search);
  }
}


/**
 * This function iterates all tasks, whether the task description or task name includes the search result
 * The result tasks are pushed in the array after matching
 *
 * @param {string} matchingIndices - array for search matches
 * @param {string} search - search input.value
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
 * This function includes search querys whehter a search is allowed or not, here only one query set
 *
 * @param {string} matchingIndices - array for search matches
 */
function displaySearchMessage(matchingIndices) {
  let resultMessageDiv = document.getElementById("resultMessageDiv");
  resultMessageDiv.style.display = "flex";
  if (matchingIndices.length === 0) {
    resultMessageDiv.innerHTML = searchResultMessageNoFound(); // outsourced in renderHTML.js
  } else if (matchingIndices.length === 1) {
    resultMessageDiv.innerHTML = searchResultMessageOneFound(matchingIndices); // outsourced in renderHTML.js
  } else {
    resultMessageDiv.innerHTML = searchResultMessageMoreFound(matchingIndices); // outsourced in renderHTML.js
  }
}


/**
 * This function hides the result message container, after click on the "go back" link  
 *
 */
async function renderAfterSearch() {
  let resultMessageDiv = document.getElementById("resultMessageDiv");
  resultMessageDiv.style.display = "none";
  await renderBoardTasks();
}


/**
 * This function creates all categegories and the corresponding tasks with the parameter "allTasksSameCategory"
 *
 * @param {string} matchingIndices - array for search matches
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
 * After the search results are displayed, the search input field will reset
 *
 */
function resetSearch() {
  document.getElementById("searchBoardInput").value = '';
}


/**
 * The search function should also start, when the key-button "enter" is pressed
 *
 */
function searchTasksByKeyPress(event) {
  if (event.key === "Enter") {
    searchTasksOnBoard();
  }
}


/////////////////////////////// END SEARCH FUNCTION ///////////////////////////////


/////////////////////////////////  MOBILE TODOS //////////////////////////////////

let timerMobileTodo;


/**
 * This function initiate the mobile menu for the todo in the mobile version
 * 
 * @param {string} taskId - the id of the current task
 */
function startTimer(taskId) {
  if (window.innerWidth <= widthForMobileSettings) {
    timerMobileTodo = setTimeout(function () {
      mobilePopupFilterTodoSettings.style.display = 'flex';
      let mobileTodoSettings = document.getElementById('mobilePopupContentTodoSettings');
      mobileTodoSettings.innerHTML = renderMobileTodoSettings(taskId);
      getMobileCurrentOpenTaskId(taskId);
    }, longTapDuration); // global variable for set time, see above
  }
}


/**
 * This function gets the index of the current todo
 * 
 * @param {string} taskId - the id of the current task
 */
function getMobileCurrentOpenTaskId(taskId) {
  let indexTodoForMobile = -1;
  for (let i = 0; i < tasks.length; i++) {
    const searchId = parseInt(tasks[i].id, 10);
    if (searchId === taskId) {
      indexTodoForMobile = i;
      break;
    }
  }
  setCurrentOpenTaskIdByIndex(indexTodoForMobile);
}


/**
 * This function saves the index value in currentOpenTaskId
 * 
 * @param {string} indexTodoForMobile - the index of the current task
 */
function setCurrentOpenTaskIdByIndex(indexTodoForMobile) {
  if (indexTodoForMobile !== -1) {
    currentOpenTaskId = indexTodoForMobile;
  }
}


/**
 * This function stops the timer
 * 
 */
function clearTimer() {
  clearTimeout(timerMobileTodo);
}


/**
 * This function renders the categories in the mobile menu
 * 
 */
function mobileTodoMove() {
  mobileTodoSettingsCategoryMenu.style.display = 'flex';
  let categoriesMenu = document.getElementById('mobileTodoSettingsCategories');
  categoriesMenu.innerHTML = '';
  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];
    categoriesMenu.innerHTML += renderMobileCategories(category);
  }
}


/**
 * This function changes the category of the todo after select the category in the menu 
 * 
 * @param {string} element - the element-div of the category in the mobile menu
 */
async function mobileMoveToCategory(element) {
  setTheSelectedCategory(element);
  resetMobileTodoSettings();
  await renderBoardTasks();
  await saveNewUserDate(); // outsourced in script.js
  let div = document.getElementById("guestMessagePopupBoard");
  let messageText = document.getElementById("guestMessageBoard");
  showGuestPopupMessage(div, messageText);
}


/**
 * This function checks which category is clicked and resets the category
 * 
 * @param {string} element - the element-div of the category in the mobile menu
 */
function setTheSelectedCategory(element) {
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
}


/**
 * This function closes the mobile menu container
 * 
 */
function resetMobileTodoSettings() {
  mobilePopupFilterTodoSettings.style.display = 'none';
}


/**
 * This function closes the mobile menu container
 * 
 * @param {string} taskId - the id of the current task
 */
function mobileTodoEdit(taskId) {
  resetMobileTodoSettings();
  openBoardTaskPopup(taskId);
  editTask();
}


/**
 * This function deletes the current task
 * 
 */
async function mobileTodoDelete() {
  await deleteTask();
  resetMobileTodoSettings();
}


//////////////////////////////// END MOBILE TODOS ////////////////////////////////


/* 
function changeImage(element, src) {
  element.querySelector(".delete").src = src;
}

function restoreImagePopupTask(element, defaultSrc) {
  element.querySelector(".delete").src = defaultSrc;
}*/