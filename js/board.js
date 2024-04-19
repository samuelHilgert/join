let todos = [{
    'id': 0,
    'title': 'Contact Form & Imprint',
    'description': 'Create a contact form and imprint page...',
    'category': 'todoCol'
}, {
    'id': 1,
    'title': 'Kochwelt Page & Recipe Recommender',
    'description': 'Build start page with recipe recommendation...',
    'category': 'inProgress'
}, {
    'id': 2,
    'title': 'HTML Base Template Creation',
    'description': 'Create reusable HTML base templates...',
    'category': 'awaitFeedback'
}, {
    'id': 3,
    'title': 'Daily Kochwelt Recipe',
    'description': 'Implement daily recipe and portion calculator....',
    'category': 'awaitFeedback'
}, {
    'id': 4,
    'title': 'CSS Architecture Planning',
    'description': 'Define CSS naming conventions and structure...',
    'category': 'done'
}];

let currentDraggedElement;

function updateHTML() {
    let todoCol = todos.filter(t => t['category'] == 'todoCol');
    let inProgress = todos.filter(t => t['category'] == 'inProgress');
    let awaitFeedback = todos.filter(t => t['category'] == 'awaitFeedback');
    let done = todos.filter(t => t['category'] == 'done');

    document.getElementById('todoCol').innerHTML = '';

    for (let index = 0; index < todoCol.length; index++) {
        const element = todoCol[index];
        document.getElementById('todoCol').innerHTML += generateTodoHTML(element);
        updateProgressBar();
    }

    document.getElementById('inProgress').innerHTML = '';

    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        document.getElementById('inProgress').innerHTML += generateTodoHTML(element);
        updateProgressBar();
    }

    document.getElementById('awaitFeedback').innerHTML = '';

    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        document.getElementById('awaitFeedback').innerHTML += generateTodoHTML(element);
        updateProgressBar();
    }

    document.getElementById('done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('done').innerHTML += generateTodoHTML(element);
        updateProgressBar();
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `<div class="todo d_c_fs_fs gap-10" draggable="true" ondragstart="startDragging(${element['id']})">
            <h6><b>${element['title']}</b></h6>
            <p>${element['description']}</p>
            <div class="d_f_c_c width-max">
                <div class="progress">
                    <div class="progress-bar" id="progressBar"></div>
                </div>
                <div class="statusText"><span id="currentTaskNumber">X</span>/<span id="">2</span><span>&nbsp;Subtasks</span></div>
            </div>
            
            </div>`;
}

function updateProgressBar() {
    let currentTaskStatus = 1;
    document.getElementById('currentTaskNumber').innerHTML = `${currentTaskStatus}`;
    let progressBar = document.getElementById('progressBar');
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
    updateHTML();
}

function highlight(id) {
    document.getElementById(id).classList.add('drag-area-highlight');
}

function removeHighlight(id) {
    document.getElementById(id).classList.remove('drag-area-highlight');
}