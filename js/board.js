let tasks = [];
let categories = ['backlog', 'inProgress', 'awaitFeedback', 'done'];
let currentDraggedTaskId;

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
            console.log('leer');
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

function renderBoardTasks() {
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
    return `<div class="todo d_c_fs_fs gap-10" onclick="openBoardTaskPopup()" draggable="true" ondragstart="startDragging(${task['id']})">
            <button class="d_f_c_c" id="btnBoard">${task['label']}</button>
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
            renderBoardTasks();
            break;
        } else {
            console.log('Task nicht gefunden!');
        }
    } 
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

function renderBoardTaskPopupContent(id) {
    const todo = tasks[id];
    let boardTaskPopupContent = document.getElementById('boardTaskPopupContent');
    boardTaskPopupContent.innerHTML = `
<div class="d_c_sb_fs gap-20 height-max">
<button class="d_f_c_c" id="btnBoard">${todo['label']}</button>
<h6><b>${todo['title']}</b></h6>
<p>${todo['description']}</p>
<p>Due date:</p>
<p>Priority:</p>
<p>Assigned To:</p>
<p>Subtasks:</p>
<div class="d_f_fe_c width-max gap-20">
    <div class="delete-style d_f_c_c gap-10">
    <img src="./assets/img/delete.svg" alt="">
    <p>Delete</p>
    </div>
    <div class="edit-style d_f_c_c gap-10">
    <img src="./assets/img/edit.svg" alt="">
    Edit
    </div>
    </div>
</div>
`;
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

function openBoardTaskPopup(id) {
    let boardTaskPopup = document.getElementById('boardTaskPopup');
    let container = document.getElementById('boardTaskPopupContainer');
    document.body.style.overflow = 'hidden';
    boardTaskPopup.style.display = 'flex';
    moveContainerIn(container);
    renderBoardTaskPopupContent(id);
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








