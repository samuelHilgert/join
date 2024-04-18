/**
 * this is a function to initialize render functions 
 * 
 */
async function init() {
    await includeHTML();
    updateHTML();
    }

/**
 * this is a function to include outsourced html elements
 * 
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[include-html]'); // Es wird nach Begriff gesucht 
    for (let i = 0; i < includeElements.length; i++) { // Es wird durchiteriert
        const element = includeElements[i]; // alle elemente sollen angesprochen werden 
        file = element.getAttribute("include-html"); // es wird der Wert des Begriffs gesucht, indem Fall der Pfad: "./header.html"
        let resp = await fetch(file); // Es besteht jetzt nur Zugang, noch nicht der Text. Ladevorgang wird als Variable deklariert, um weiter arbeiten zu können
        if (resp.ok) { // Abfrage, um auf Fehler zu prüfen
            element.innerHTML = await resp.text(); // wenn gefunden, Datei wird aufgerufen und Inhalt ausgegeben 
        } else {
            element.innerHTML = 'Page not found'; // wenn nicht gefunden, Ausgabe Fehlermeldung text
        }
    }
}




/************************ DRAG AND DROP TESTING BY SAMUEL ***************************/

let todos = [{
    'id': 0,
    'title': 'Kochwelt Page & Recipe Recommender',
    'category': 'inProgress'
}, {
    'id': 1,
    'title': 'HTML Base Template Creation',
    'category': 'awaitFeedback'
}, {
    'id': 2,
    'title': 'Daily Kochwelt Recipe',
    'category': 'awaitFeedback'
}, {
    'id': 3,
    'title': 'CSS Architecture Planning',
    'category': 'done'
}];

let currentDraggedElement;

function updateHTML() {
    let open = todos.filter(t => t['category'] == 'open');
    let inProgress = todos.filter(t => t['category'] == 'inProgress');
    let awaitFeedback = todos.filter(t => t['category'] == 'awaitFeedback');
    let done = todos.filter(t => t['category'] == 'done');

    document.getElementById('open').innerHTML = '';

    for (let index = 0; index < open.length; index++) {
        const element = open[index];
        document.getElementById('open').innerHTML += generateTodoHTML(element);
    }

    document.getElementById('inProgress').innerHTML = '';

    for (let index = 0; index < inProgress.length; index++) {
        const element = inProgress[index];
        document.getElementById('inProgress').innerHTML += generateTodoHTML(element);
    }

    document.getElementById('awaitFeedback').innerHTML = '';

    for (let index = 0; index < awaitFeedback.length; index++) {
        const element = awaitFeedback[index];
        document.getElementById('awaitFeedback').innerHTML += generateTodoHTML(element);
    }

    document.getElementById('done').innerHTML = '';

    for (let index = 0; index < done.length; index++) {
        const element = done[index];
        document.getElementById('done').innerHTML += generateTodoHTML(element);
    }
}

function startDragging(id) {
    currentDraggedElement = id;
}

function generateTodoHTML(element) {
    return `<div draggable="true" ondragstart="startDragging(${element['id']})" class="todo">${element['title']}</div>`; 
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

/************************************************************************************/