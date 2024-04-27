let tasks = [];
let categories = ['backlog', 'inProgress', 'awaitFeedback', 'done'];
let currentDraggedTaskId;
let taskId;
/**
 * This is a function that checks whether a guest or user has logged in
 * The data is only saved remotely if the user is logged in
 * In both cases sample contacts are also loaded
 * 
 */
async function updateBoardTasks() {
    if (loggedAsGuest === true) {
        await loadExampleTasks();
    } else {
        let currentUserTasks = users[currentUser].tasks;
        if (currentUserTasks.length === 0) {
            await loadExampleTasks();
            await pushTasksOnRemoteServer();
        }
        else {
            tasks = users[currentUser].tasks;
        }
    }
}

async function loadExampleTasks() {
    let resp = await fetch('./JSON/tasks.json');
    tasks = await resp.json();
}

async function pushTasksOnRemoteServer() {
    users[currentUser].tasks = tasks;
    await setItem('users', JSON.stringify(users));
}

async function renderBoardTasks() {
    if (tasks.length === 0) {
        let div = document.getElementById('guestMessagePopupBoard');
        let messageText = document.getElementById('guestMessageBoard');
        showGuestPopupMessageForReload(div, messageText);
        await updateBoardTasks();
    }
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const allTasksSameCategory = tasks.filter(t => t['category'] == category);
        const categoryTableColumn = document.getElementById(`${category}`);
        categoryTableColumn.innerHTML = '';
        showTasksForEachCategory(allTasksSameCategory, categoryTableColumn);
    }
}

function showTasksForEachCategory(allTasksSameCategory, categoryTableColumn) {
    for (let k = 0; k < allTasksSameCategory.length; k++) {
        const task = allTasksSameCategory[k];
        categoryTableColumn.innerHTML += generateTodoHTML(task);
        updateProgressBar(task);
    }
}

function generateTodoHTML(task) {
    return `<div class="todo d_c_fs_fs gap-10" onclick="openBoardTaskPopup(${task['id']})" draggable="true" ondragstart="startDragging(${task['id']})">
            <div class="btn-board d_f_fs_fs" id="">${task['label']}</div>
            <h6><b>${task['title']}</b></h6>
            <p>${task['description']}</p>
            <div class="d_f_c_c width-max">
                <div class="progress">
                    <div class="progress-bar" id="progressBar${task['id']}"></div>
                </div>
                <div class="statusText"><span id="currentTaskNumber${task['id']}">X</span>/<span id="">2</span><span>&nbsp;Subtasks</span></div>
            </div>
            <div class="d_f_sb_c width-max">
            <div>
            <img src="./assets/img/profile-board.svg" alt="">
            <img src="./assets/img/profile-board.svg" alt="">
            <img src="./assets/img/profile-board.svg" alt="">
            </div>
            <img src="./assets/img/priority.svg" alt=""></div>
            </div>`;
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
            if (!loggedAsGuest === true || loggedAsGuest === false) {
                await pushTasksOnRemoteServer();
            } else {
                let div = document.getElementById('guestMessagePopupBoard');
                let messageText = document.getElementById('guestMessageBoard');
                showGuestPopupMessage(div, messageText);
            }
        }
    }
    await renderBoardTasks();
}

function allowDrop(event) {
    event.preventDefault();
}


function updateProgressBar(task) {
    let currentTaskStatus = 1;
    document.getElementById(`currentTaskNumber${task['id']}`).innerHTML = `${currentTaskStatus}`;
    let progressBar = document.getElementById(`progressBar${task['id']}`);
    if (currentTaskStatus === 1) {
        progressBar.style.width = `50%`;
        progressBar.classList.add('blue');
    } else if (currentTaskStatus === 2) {
        progressBar.style.width = `100%`;
        progressBar.classList.add('blue');
    }
}

function doNotClose(event) {
    event.stopPropagation();
}

function openBoardTaskPopup(openId) {
    let boardTaskPopup = document.getElementById('boardTaskPopup');
    let container = document.getElementById('boardTaskPopupContainer');
    document.body.style.overflow = 'hidden';
    boardTaskPopup.style.display = 'flex';
    let openIdString = String(openId);
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === openIdString) {
            taskId = i;
        }
    }
    moveContainerIn(container);
    renderBoardTaskPopupContent(taskId);
}

function renderBoardTaskPopupContent(taskId) {
    const todo = tasks[taskId];
    showTaskText(todo);
}

function showTaskText(todo) {
    let taskPopupContentLabel = document.getElementById('taskPopupContentLabel');
    let taskPopupContentTitle = document.getElementById('taskPopupContentTitle');
    let taskPopupContentDescription = document.getElementById('taskPopupContentDescription');
    let taskPopupContentDueDate = document.getElementById('taskPopupContentDueDate');
    let taskPopupContentPriority = document.getElementById('taskPopupContentPriority');
    let taskPopupContentAssignedTo = document.getElementById('taskPopupContentAssignedTo');
    let taskPopupContentSubtasks = document.getElementById('taskPopupContentSubtasks');
    taskPopupContentLabel.innerHTML = `${todo['label']}`;
    taskPopupContentTitle.innerHTML = `<h6><b>${todo['title']}</b></h6>`;
    taskPopupContentDescription.innerHTML = `<p>${todo['description']}</p>`;
    taskPopupContentDueDate.innerHTML = `
    <div class="d_f_fs_c width-50 gap-30">
        <p>Due date:</p>
    </div>
    <div class="d_f_fs_c width-50 gap-30" >
        <p>${todo['dueDate']}</p>
    </div>
    `;
    taskPopupContentPriority.innerHTML = `
    <div class="d_f_fs_c width-50 gap-30">
        <p>Priority:</p>
    </div>
    <div class="d_f_fs_c width-50 gap-30">
        <p>${todo['priority']}</p>
    </div>
    `;
    taskPopupContentAssignedTo.innerHTML = `
    <p>Max Mustermann</p>
    <p>Thorsten Haas</p>
    <p>Uwe Schmidt</p>
    `;
    taskPopupContentSubtasks.innerHTML = `
    <p>Start Page Layout</p>
    <p>Implement Recipe</p>
    `;
}

async function editTask() {
    let taskPopupContentTitle = document.getElementById('taskPopupContentTitle');
    let taskPopupContentDescription = document.getElementById('taskPopupContentDescription');
    let taskPopupContentDueDate = document.getElementById('taskPopupContentDueDate');
    let taskPopupContentPriority = document.getElementById('taskPopupContentPriority');
    let taskPopupContentAssignedTo = document.getElementById('taskPopupContentAssignedTo');
    let taskPopupContentSubtasks = document.getElementById('taskPopupContentSubtasks');
    document.getElementById('taskPopupContentLabel').style.display ='none';
    taskPopupContentTitle.innerHTML = `<p>Title</p><input>`;
    taskPopupContentDescription.innerHTML = `<p>Description</p><input>`;
    taskPopupContentDueDate.style.flexDirection = 'column';
    taskPopupContentDueDate.style.alignItems = 'flex-start';
    taskPopupContentDueDate.innerHTML = `<p>Due Date</p><input>`;
    taskPopupContentPriority.innerHTML = `<p>Priority</p><input>`;
    taskPopupContentPriority.style.flexDirection = 'column';
    taskPopupContentPriority.style.alignItems = 'flex-start';
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
    document.getElementById('boardTaskPopup').style.display = 'none';
    document.body.style.overflow = 'scroll';
    tasks.splice(taskId, 1);
    if (!loggedAsGuest === true || loggedAsGuest === false) {
        await pushTasksOnRemoteServer();
    } else {
        let div = document.getElementById('guestMessagePopupBoard');
        let messageText = document.getElementById('guestMessageBoard');
        showGuestPopupMessage(div, messageText);
    }
    await renderBoardTasks();
}

function openBoardAddTaskPopup() {
    let boardAddTaskPopup = document.getElementById('boardAddTaskPopup');
    let container = document.getElementById('boardAddTaskPopupContainer');
    boardAddTaskPopup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    moveContainerIn(container);
}

function closeBoardAddTaskPopup() {
    let popup = document.getElementById('boardAddTaskPopup');
    let container = document.getElementById('boardAddTaskPopupContainer');
    moveContainerOut(container);
    setTimeout(function () {
        displayNonePopup(popup);
    }, 500);
    document.body.style.overflow = 'scroll';
}

function closeBoardTaskPopup() {
    let popup = document.getElementById('boardTaskPopup');
    let container = document.getElementById('boardTaskPopupContainer');
    moveContainerOut(container);
    setTimeout(function () {
        displayNonePopup(popup);
    }, 500);
    document.body.style.overflow = 'scroll';
}








