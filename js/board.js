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
    return `<div class="todo d_c_fs_fs gap-10" onclick="openBoardTaskPopup(${task['id']})" draggable="true" ondragstart="startDragging(${task['id']})">
            <div class="d_f_fs_fs" id="btnBoard">${task['label']}</div>
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
    renderBoardTasks();
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
    let boardTaskPopupContent = document.getElementById('boardTaskPopupContent');
    boardTaskPopupContent.innerHTML = `
<div class="d_c_fs_fs gap-40 height-max">
    <div class="d_f_fs_c width-max" id="btnBoard">${todo['label']}</div>
    <h6><b>${todo['title']}</b></h6>
    <p>${todo['description']}</p>
    <div class="d_c_fs_fs gap-20 width-max">
        <div class="d_f_sb_c width-50"><p>Due date:</p><p>${todo['dueDate']}</p></div>
        <div class="d_f_sb_c width-50"><p>Priority:</p><p>${todo['priority']}</p></div>
        <div class="d_f_sb_c width-50"><p>Assigned To:</p><p>XX</p></div>
        <div class="d_f_sb_c width-50"><p>Subtasks:</p><p>XX</p></div>
    </div>
</div>
<div class="d_f_fe_c width-max gap-20">
<div class="delete-style d_f_c_c gap-10" onclick="deleteContact()">
    <img src="./assets/img/delete.svg" alt="">
    <p>Delete</p>
</div>
<div class="edit-style d_f_c_c gap-10">
    <img src="./assets/img/edit.svg" alt="">
    Edit
</div>
</div>
`;
}

async function deleteContact() {
    let div = document.getElementById('boardTaskPopup');
    closeGuestPopupMessage(div);
    tasks.splice(taskId, 1);
    if (!loggedAsGuest === true || loggedAsGuest === false) {
        await pushTasksOnRemoteServer();
    } else {
        let messageText = document.getElementById('guestMessageBoard');
        showGuestPopupMessage(div, messageText);
    }
    renderBoardTasks();
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








