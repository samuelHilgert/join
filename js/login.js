/**
 * This function is called when the login form is submitted, it checks whether the data matches the registration 
 * 
 */

let successEmail = false;
let successPassword = false;

async function checkLoginAccess() {
    loginBtn.disabled = true; // registerBtn ist die id vom button Absenden
    searchRegisterEmail();
    searchRegisterPassword();
    console.log('Email vorhanden: ' + successEmail);
    console.log('Passwort vorhanden: ' + successEmail);
}

function searchRegisterEmail() {
    for (let index = 0; index < users.length; index++) {
        const usersEmail = users[index]['email'];
        if (loginEmail.value === usersEmail) {
            successEmail = true; 
        }
        else {
            successEmail = false; 
        }
    }
}

function searchRegisterPassword() {
    for (let index = 0; index < users.length; index++) {
        const usersPassword = users[index]['password'];
        if (loginPassword.value === usersPassword) {
            successPassword = true; 
        }
        else {
            successPassword = false; 
        }
    }
}

/*
function showLoginMessage() {
    let messageFormLogin = document.getElementById('messageFormLogin');
    messageFormLogin.style.display = 'flex';
    if (registerSuccess === true) {
        messageFormLogin.innerHTML = 'You login was successfully';
    }
    if (checkbox === false) {
        messageFormLogin.innerHTML = 'Your password is not correct!';
    }
    if (registerSuccess === false && checkbox === true) {
        messageFormLogin.innerHTML = 'The passwords do not match';
    }
}
*/