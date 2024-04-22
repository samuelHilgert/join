let allTasks = [];
let dropdownContact = [];
let subtasks = [];

// Funktion zum Hinzufügen einer Aufgabe
function addTask() {
  const taskInput = readTaskInput();
  const prio = determinePriority();

  const task = {
    title: taskInput.title,
    description: taskInput.description,
    assignedTo: dropdownContact,
    date: new Date(taskInput.date).getTime(),
    prio: prio,
    category: taskInput.category,
    subtask: subtasks,
  };
  allTasks.push(task);
  dropdownContact = [];
  setItem("task", allTasks);
}

function readTaskInput() {
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-description").value;
  const date = document.getElementById("task-date").value;
  const category = document.getElementById("task-category").value;
  const subtask = document.getElementById("subtask").value;

  return {
    title: title,
    description: description,
    date: date,
    category: category,
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
function setPriority(prio = "medium-btn") {
  const buttons = document.querySelectorAll(".task-input-style.input-prio");
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
  <div class="d_f_c_c gap-5 padding-right-36">
  <img onclick='clearSubtaskInput()' class='padding-10' src="assets/img/input-cross.png" alt="cross" />
  <div class='input-spacer'></div>
  <img onclick='addSubtask()' style='height: 17px;' class='padding-10' src="assets/img/input-check.png" alt="check" />
</div>
  `;
}

function addSubtask() {
  const subtaskInput = document.getElementById("subtask");
  const subtaskValue = subtaskInput.value.trim(); // Trimmen Sie den Wert, um führende und nachfolgende Leerzeichen zu entfernen
  if (subtaskValue !== "") {
    subtasks.push(subtaskValue);
    const subtaskContainer = document.getElementById("subtask-div");
    subtaskContainer.innerHTML += `
          <div class='d_f_sb_c pad-x-10'>
              <span><span style='color: red'>●</span> ${subtaskValue}</span>
              <div class='d_f_c_c gap-5'>
                  <img src="assets/img/pen_dark.svg" alt="pen" class='cursor-pointer' onclick="editSubtask(this)" />
                  <img src="assets/img/trash_dark.svg" alt="trash" class='cursor-pointer' onclick="deleteSubtask(this)" />
              </div>
          </div>
      `;
    subtaskInput.value = ""; // Leeren Sie das Eingabefeld nach dem Hinzufügen der Unteraufgabe
  }
}

function editSubtask(element) {
  const subtaskText = element.parentNode.previousElementSibling;
  const newText = prompt("Edit Subtask:", subtaskText.textContent);
  if (newText !== null) {
    subtaskText.textContent = newText;
  }
}

function deleteSubtask(element) {
  const subtaskContainer = document.getElementById("subtask-div");
  const subtaskItem = element.parentNode.parentNode;
  subtaskContainer.removeChild(subtaskItem);
}

function clearSubtaskInput() {}
