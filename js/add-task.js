let allTasks = [];
let dropdownContact = [];

// Funktion zum Hinzufügen einer Aufgabe
function addTask() {
  const taskInput = readTaskInput();
  const prio = determinePriority();

  const task = {
    title: taskInput.title,
    description: taskInput.description,
    assignedTo: taskInput.assignedTo,
    date: new Date(taskInput.date).getTime(),
    prio: prio,
    category: taskInput.category,
    subtask: taskInput.subtask,
  };
  allTasks.push(task);
  dropdownContact = [];
}

function readTaskInput() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const assignedTo = document.getElementById("task-title").value;
  const date = document.getElementById("task-date").value;
  const category = document.getElementById("task-category").value;
  const subtask = document.getElementById("task-subtask").value;

  return {
    title: title,
    description: description,
    assignedTo: assignedTo,
    date: date,
    category: category,
    subtask: subtask,
  };
}

function determinePriority() {
  const mediumButton = document.getElementById("medium-btn");
  const urgentButton = document.getElementById("urgent-btn");
  const lowButton = document.getElementById("low-btn");

  const prio =
    getPriorityFromButtonColor(mediumButton) ||
    getPriorityFromButtonColor(urgentButton) ||
    getPriorityFromButtonColor(lowButton);

  return prio;
}

// Funktion zum Ermitteln der Priorität basierend auf der Hintergrundfarbe eines Buttons
function getPriorityFromButtonColor(button) {
  const backgroundColor = button.style.backgroundColor;
  if (backgroundColor === "rgb(255, 168, 0)") {
    return "medium";
  } else if (backgroundColor === "rgb(255, 61, 0)") {
    return "urgent";
  } else if (backgroundColor === "rgb(122, 226, 41)") {
    return "low";
  } else {
    return ""; // Standardwert, falls keine Priorität gefunden wird
  }
}

// Funktion zum Einfärben des ausgewählten Buttons und Zurücksetzen der anderen Buttons
function setPriority(prio) {
  const buttons = document.querySelectorAll(".input-style.input-prio");
  buttons.forEach(function (btn) {
    btn.style.backgroundColor = ""; // Standardfarbe (keine Hintergrundfarbe)
  });

  const button = document.getElementById(prio);
  if (prio === "medium-btn") {
    button.style.backgroundColor = "#FFA800";
  } else if (prio === "urgent-btn") {
    button.style.backgroundColor = "#FF3D00";
  } else if (prio === "low-btn") {
    button.style.backgroundColor = "#7AE229";
  }
}

function openDropdownContacts() {
  let Dropdownmenu = document.getElementById("inputfield-dropdown");
  let dropdownArrow = document.getElementById("dropdown-arrow");
  let dropdownDiv = document.getElementById("dropdown-div");
  dropdownDiv.style.display =
    dropdownDiv.style.display === "flex" ? "none" : "flex";

  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i];
    dropdownDiv.innerHTML += `
    <div class="parting-line-dropdown"></div>
    <div class="dropdown-contact" id='test${i}'onclick='chooseContact(${i},"${element.name}")' >
      <div class="contact-circle d_f_c_c">
        <div class="contact-circle-letters">AM</div>
      </div>
      <div class="contact-name-mail">
        <div class="contact-name">${element.name}</div>
      </div>
    </div>
    `;
  }
}
function chooseContact(i, name) {
  constElement = document.getElementById(`test${i}`);
  constElement.style.backgroundColor = "red";
  dropdownContact.push(name);
}

function changeIcons() {
  let iconBox = document.getElementById("dropdown-icon");
  iconBox.innerHTML = `
  <img class='padding-10' src="assets/img/input-cross.png" alt="cross" />
  <img onclick='addSubtask()' class='padding-10' src="assets/img/input-cross.png" alt="check" />
  `;
}

function addSubtask() {
  const subtask = document.getElementById("task-subtask").value;
  const subtaskContainer = document.getElementById("subtask-div");
  subtaskContainer.innerHTML += `<div><span>${subtask}</span></div>`;
  console.log(subtask);
}
