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
  // showGuestMessageOnBoard();
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