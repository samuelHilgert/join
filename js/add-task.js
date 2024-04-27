let allTasks = [];
let dropdownContact = [];
let subtasks = [];

// function to add the task
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
  subtasks = [];
  setItem("task", allTasks);
}

//get informations from input
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

//for the contacts at Assigned to section
function openDropdownContacts() {
  let Dropdownmenu = document.getElementById("inputfield-dropdown");
  let dropdownArrow = document.getElementById("dropdown-arrow");
  let dropdownDiv = document.getElementById("task-contact-div");
  dropdownDiv.style.display =
    dropdownDiv.style.display === "flex" ? "none" : "flex";
  rotateDropdownIcon(dropdownArrow, dropdownDiv.style.display === "flex");
  for (let i = 0; i < contacts.length; i++) {
    const element = contacts[i];
    dropdownDiv.innerHTML += `
    <div class="parting-line-dropdown"></div>
    <div class="task-contact" id='test${i}'onclick='chooseContact(${i},"${element.name}")' >
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

//Change Prio Btn colors!
function setPriority(btnId) {
  removeActiveClasses();
  setActiveClasses(btnId);
}

//Return Value from Priority!
function determinePriority() {
  let prio = "medium"; // Standardpriorität
  const urgentBtn = document.getElementById("urgent-btn");
  const mediumBtn = document.getElementById("medium-btn");
  const lowBtn = document.getElementById("low-btn");
  if (urgentBtn.classList.contains("active-prio-btn-urgent")) {
    prio = "urgent";
  } else if (lowBtn.classList.contains("active-prio-btn-low")) {
    prio = "low";
  }
  return prio;
}

function setActiveClasses(btnId) {
  const clickedButton = document.getElementById(btnId);
  const buttonImg = clickedButton.querySelector("img");

  switch (btnId) {
    case "urgent-btn":
      clickedButton.classList.add("active-prio-btn-urgent");
      buttonImg.classList.add("filter-prio-btn");
      break;
    case "medium-btn":
      clickedButton.classList.add("active-prio-btn-medium");
      break;
    case "low-btn":
      clickedButton.classList.add("active-prio-btn-low");
      buttonImg.classList.add("filter-prio-btn");
      break;
    default:
      break;
  }
}

function removeActiveClasses() {
  const buttons = ["urgent-btn", "medium-btn", "low-btn"];
  buttons.forEach((button) => {
    const buttonElement = document.getElementById(button);
    buttonElement.classList.remove(
      "active-prio-btn-urgent",
      "active-prio-btn-medium",
      "active-prio-btn-low"
    );
    buttonElement.querySelector("img").classList.remove("filter-prio-btn");
  });
}

// for category section
function chooseCategory(category) {
  document.getElementById("task-category").value = category.innerText;
}

function toggleCategoryDiv() {
  var categoryDiv = document.getElementById("category-div");
  var dropdownIcon = document.getElementById("category-drop-icon");
  if (
    categoryDiv.style.display === "none" ||
    categoryDiv.style.display === ""
  ) {
    categoryDiv.style.display = "flex";
    dropdownIcon.style.transform = "rotate(180deg)";
  } else {
    categoryDiv.style.display = "none";
    dropdownIcon.style.transform = "";
  }
}

//for subtasks section
function addSubtask() {
  const subtaskInput = document.getElementById("subtask");
  const subtaskValue = subtaskInput.value.trim();
  if (subtaskValue !== "") {
    const subtaskContainer = document.getElementById("subtask-div");
    subtasks.push(subtaskValue);
    renderSubtasks(subtaskContainer);
    subtaskInput.value = "";
    changeIcons();
  }
}

function getSubtaskIndex(element) {
  const subtaskContainer = document.getElementById("subtask-div");
  const subtaskIndex = Array.from(subtaskContainer.children).indexOf(
    element.parentNode.parentNode
  );
  return subtaskIndex;
}

function renderSubtasks(container) {
  container.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    container.innerHTML += `
      <div id='subtask${index}' class='d_f_sb_c pad-x-10'>
        <span>● ${subtask}</span>
        <div class='d_f_c_c gap-5'>
          <img src="assets/img/pen_dark.svg" alt="pen" class='cursor-pointer' onclick="editSubtask(this)" />
          <img src="assets/img/trash_dark.svg" alt="trash" class='cursor-pointer' onclick="deleteSubtask(${index})" />
        </div>
      </div>
    `;
  });
}

function changeIcons() {
  let iconBox = document.getElementById("dropdown-icon");
  iconBox.classList.remove("input-icon-div");
  iconBox.classList.add("input-icon");

  iconBox.innerHTML = `
    <div class="d_f_c_c gap-5 padding-right-36">
    <div onclick='clearSubtaskInput()' class="icon-edit-delete"> <img src="assets/img/input-cross.png" alt="cross" /></div>
      <div class='input-spacer'></div>
      <div onclick='addSubtask(),clearSubtaskInput()' class="icon-edit-delete"> <img style='height: 17px;' src="assets/img/input-check.png" alt="check" /></div>
    </div>
  `;
}

function editSubtask(element) {
  const subtaskContainer = document.getElementById("subtask-div");
  const subtaskIndex = getSubtaskIndex(element);
  if (subtaskIndex !== -1) {
    const subtaskInput = document.getElementById("subtask");
    subtaskInput.value = subtasks[subtaskIndex];
    subtasks.splice(subtaskIndex, 1);
    renderSubtasks(subtaskContainer);
  }
  changeIcons();
}

function deleteSubtask(i) {
  subtasks.splice(i, 1);
  document.getElementById(`subtask${i}`).remove();
}

function clearSubtaskInput() {
  let subtaskInput = document.getElementById("subtask");
  subtaskInput.value = "";
  subtaskInput.blur();
  let iconBox = document.getElementById("dropdown-icon");
  iconBox.innerHTML = `
   <div onclick="changeIcons()" class='icon-edit-delete'><img src="assets/img/input-plus.png" alt="plus" /></div>
  `;
}

//clear the hole form
function clearForm() {
  document.getElementById("task-title").value = "";
  document.getElementById("task-description").value = "";
  document.getElementById("task-date").value = "";
  document.getElementById("task-category").value = "";
  document.getElementById("subtask").value = "";
  document.getElementById("task-assignedTo").value = "";
  document.getElementById("subtask-div").innerHTML = "";
  document.getElementById("dropdown-div").style.display = "none";
  dropdownContact = [];
  subtasks = [];
  setPriority("medium-btn");
}

function rotateDropdownIcon(icon, isOpen) {
  if (isOpen) {
    icon.style.transform = "rotate(180deg)";
  } else {
    icon.style.transform = "";
  }
}

function setMinimumDate() {
  var currentDate = new Date();
  var minDate = currentDate.toISOString().split("T")[0];
  document.getElementById("task-date").setAttribute("min", minDate);
}

function enableSubtaskEnterKey() {
  document
    .getElementById("subtask")
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        addSubtask(); // Subtask hinzufügen
        event.preventDefault(); // Standardverhalten der Enter-Taste verhindern (z.B. Formularabsenden)
      }
    });
}
