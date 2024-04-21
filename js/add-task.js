let allTasks = [];

function addTask() {
  let title = document.getElementById("task-title").value;
  let description = document.getElementById("task-description").value;
  let assignedTo = document.getElementById("task-title").value;
  let date = document.getElementById("task-date").value;
  let prio = document.getElementById("task-date").value;
  let category = document.getElementById("task-category").value;

  let task = {
    title: title,
    description: description,
    assignedTo: [],
    date: new Date(date).getTime(),
    prio: [],
    category: category,
    subtask: [],
  };

  console.log(task.category);
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
    <div class="dropdown-contact">
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
