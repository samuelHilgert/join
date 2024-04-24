let todos = [{
    'id': 0,
    'label': 'User Story',
    'title': 'Contact Form & Imprint',
    'description': 'Create a contact form and imprint page...',
    'category': 'todoCol'
}, {
    'id': 1,
    'label': 'User Story',
    'title': 'Kochwelt Page & Recipe Recommender',
    'description': 'Build start page with recipe recommendation...',
    'category': 'inProgress'
}, {
    'id': 2,
    'label': 'Technical Task',
    'title': 'HTML Base Template Creation',
    'description': 'Create reusable HTML base templates...',
    'category': 'awaitFeedback'
}, {
    'id': 3,
    'label': 'User Story',
    'title': 'Daily Kochwelt Recipe',
    'description': 'Implement daily recipe and portion calculator....',
    'category': 'awaitFeedback'
}, {
    'id': 4,
    'label': 'Technical Task',
    'title': 'CSS Architecture Planning',
    'description': 'Define CSS naming conventions and structure...',
    'category': 'done'
}];

let currentDraggedElement;

function renderBoardCards() {
    let todoCol = todos.filter(t => t['category'] == 'todoCol');
    let inProgress = todos.filter(t => t['category'] == 'inProgress');
    let awaitFeedback = todos.filter(t => t['category'] == 'awaitFeedback');
    let done = todos.filter(t => t['category'] == 'done');
    let label = todos.filter(t => t['category'] == 'label');

    document.getElementById('todoCol').innerHTML = '';

    for (let index = 0; index < todoCol.length; index++) {
        const element = todoCol[index];
        const elementId = element['id'];
        document.getElementById('todoCol').innerHTML += generateTodoHTML(element, elementId);
        updateProgressBar(elementId);
    }

    document.getElementById('inProgress').innerHTML = '';

    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        const elementId = element['id'];
        document.getElementById('inProgress').innerHTML += generateTodoHTML(element, elementId);
        updateProgressBar(elementId);
    }

    document.getElementById('awaitFeedback').innerHTML = '';

    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        const elementId = element['id'];
        document.getElementById('awaitFeedback').innerHTML += generateTodoHTML(element, elementId);
        updateProgressBar(elementId);
    }

    document.getElementById('done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        const elementId = element['id'];
        document.getElementById('done').innerHTML += generateTodoHTML(element, elementId);
        updateProgressBar(elementId);
    }
    /*
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
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element, elementId) {
    return `<div class="todo d_c_fs_fs gap-10" onclick="openBoardTaskPopup(${elementId})" draggable="true" ondragstart="startDragging(${element['id']})">
            <button class="d_f_c_c" id="btnBoard">${element['label']}</button>
            <h6><b>${element['title']}</b></h6>
            <p>${element['description']}</p>
            <div class="d_f_c_c width-max">
                <div class="progress">
                    <div class="progress-bar" id="progressBar${element['id']}"></div>
                </div>
                <div class="statusText"><span id="currentTaskNumber${element['id']}">X</span>/<span id="">2</span><span>&nbsp;Subtasks</span></div>
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

function updateProgressBar(elementId) {
    let currentTaskStatus = 1;
    document.getElementById(`currentTaskNumber${elementId}`).innerHTML = `${currentTaskStatus}`;
    let progressBar = document.getElementById(`progressBar${elementId}`);
    if (currentTaskStatus === 1) {
        progressBar.style.width = `50%`;
        progressBar.classList.add('blue');
    } else if (currentTaskStatus === 2) {
        progressBar.style.width = `100%`;
        progressBar.classList.add('blue');
    }
}

function allowDrop(ev) {
    ev.preventDefault();
}

function moveTo(category) {
    todos[currentDraggedElement]['category'] = category;
    renderBoardCards();
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

function renderBoardTaskPopupContent(elementId) {
    const todo = todos[elementId];
    console.log(todo);
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
    setTimeout(function() {
        displayNonePopup(popup);
    }, 500);
    document.body.style.overflow = 'scroll';
}

function openBoardTaskPopup(elementId) {
    let boardTaskPopup = document.getElementById('boardTaskPopup');
    let container = document.getElementById('boardTaskPopupContainer');
    document.body.style.overflow = 'hidden';
    boardTaskPopup.style.display = 'flex';
    moveContainerIn(container);
    renderBoardTaskPopupContent(elementId);
}

function closeBoardTaskPopup() {
    let popup = document.getElementById('boardTaskPopup');
    let container = document.getElementById('boardTaskPopupContainer');
    moveContainerOut(container);
    setTimeout(function() {
        displayNonePopup(popup);
    }, 500);
    document.body.style.overflow = 'scroll';
}








