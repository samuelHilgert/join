let tasks = [];
let categories = ['backlog', 'inProgress', 'awaitFeedback', 'done'];

let currentDraggedElement;

async function renderBoardCards() {
    let resp = await fetch('./JSON/user_tasks.json');
    tasks = await resp.json();

    for (let id = 0; id < categories.length; id++) {
    const category = categories[id];
    const categoriesBySameName = tasks.filter(t => t['category'] == category);
    const taskDiv = document.getElementById(`${category}`); 
    taskDiv.innerHTML = '';
    renderFunction(categoriesBySameName, taskDiv, id);
    }

    function renderFunction(categoriesBySameName, taskDiv, id) {
        for (let k = 0; k < categoriesBySameName.length; k++) {
            const element = categoriesBySameName[k];
            taskDiv.innerHTML += generateTodoHTML(element, id);
            updateProgressBar(id);
        }
    }
    
}
/* 
    let label = todos.filter(t => t['category'] == 'label');

        document.getElementById('label').innerHTML = '';
    
        for (let index = 0; index < label.length; index++) {
            const element = label[index];
            const elementId = element['id'];
            document.getElementById('label').innerHTML += generateTodoHTML(element);
            updateProgressBar(elementId);
            if (element['label'] === 'User Story') {
                document.getElementById('btnBoard').style.backgroundColor = 'rgba(0, 56, 255, 1)';
            }
            if (element['label'] === 'Technical Task') {
                document.getElementById('btnBoard').style.backgroundColor = 'rgba(31, 215, 193, 1)';
            }
        }*/

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element, id) {
    return `<div class="todo d_c_fs_fs gap-10" onclick="openBoardTaskPopup(${id})" draggable="true" ondragstart="startDragging(${id})">
            <button class="d_f_c_c" id="btnBoard">${element['label']}</button>
            <h6><b>${element['title']}</b></h6>
            <p>${element['description']}</p>
            <div class="d_f_c_c width-max">
                <div class="progress">
                    <div class="progress-bar" id="progressBar${id}"></div>
                </div>
                <div class="statusText"><span id="currentTaskNumber${id}">X</span>/<span id="">2</span><span>&nbsp;Subtasks</span></div>
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

function updateProgressBar(id) {
    let currentTaskStatus = 1;
    document.getElementById(`currentTaskNumber${id}`).innerHTML = `${currentTaskStatus}`;
    let progressBar = document.getElementById(`progressBar${id}`);
    if (currentTaskStatus === 1) {
        progressBar.style.width = `50%`;
        progressBar.classList.add('blue');
    } else if (currentTaskStatus === 2) {
        progressBar.style.width = `100%`;
        progressBar.classList.add('blue');
    }
}

function allowDrop(event) {
    event.preventDefault();
}

async function moveTo(currentCategory) {
    let test = tasks[currentDraggedElement]['category'] = currentCategory;
    console.log(test);
    console.log(currentCategory);
    await saveChangesInJSON();
    renderBoardCards();
}

async function saveChangesInJSON() {
// BRWOSER KANN NICHTS IN DAS .JSON DOC SPEICHERN; DAHER MIT REMOTE SERVER MACHEN
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








