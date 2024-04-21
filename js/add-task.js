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
