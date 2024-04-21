let successEmail = false;
let successPassword = false;
let indexByEmail;

/**
 * This function is called when the login form is submitted, it checks whether the data matches the registration 
 * 
 */
async function checkLoginAccess() {
    loginBtn.disabled = true; // registerBtn ist die id vom button Absenden
    iterateUsers();
}

function iterateUsers() {
    if (successCheck()) {
        successEmail = true;
        successPassword = true;
        indexByEmail = getUserId(loginEmail.value);
        let userId = getUserId();
        console.log(userId);
        showLoginMessage();
        setTimeout(forwardToSummary, messageDisplayTime);
    } else {
        if (emailNotFound()) {
            successEmail = false;
            loginErrorReset();
            showLoginMessage();
            setTimeout(messageDisplayFormLogin, messageDisplayTime);
        }
        if (onlyEmailCorrect()) {
            successEmail = true;
            successPassword = false;
            loginErrorReset();
            showLoginMessage();
            setTimeout(messageDisplayFormLogin, messageDisplayTime);
        }
    }
}

function emailNotFound() {
    return users.some(user => user.email !== loginEmail.value);
}

function successCheck() {
    return users.some(user => user.email === loginEmail.value && user.password === loginPassword.value);
}

function onlyEmailCorrect() {
    return users.some(user => user.email === loginEmail.value && user.password !== loginPassword.value);
}

function getUserId(loggedEmail) {
    const index = users.findIndex(user => user.email === loggedEmail);
    return index;
}

function loginErrorReset() {
    loginPassword.value = '';
    loginBtn.disabled = false;
}

function showLoginMessage() {
    let messageFormLogin = document.getElementById('messageFormLogin');
    messageFormLogin.style.display = 'flex';
    if (successEmail === false && successPassword === false) {
        messageFormLogin.innerHTML = 'email not found';
    }
    if (successPassword === false && successEmail === true) {
        messageFormLogin.innerHTML = 'password is not correct!';
    }
    if (successEmail === true && successPassword === true) {
        messageFormLogin.innerHTML = 'login successfully';
    }
}

/**
 * This function set message display to none
 * 
 */
function messageDisplayFormLogin() {
    let messageFormLogin = document.getElementById('messageFormLogin');
    messageFormLogin.style.display = 'none';
}

/**
 * This function forwarding the user to summary.html with a success message in the URL
 * 
 */
function forwardToSummary() {
    window.location.href = `./summary.html?msg=Du hast dich erfolgreich angemeldet "${users[indexByEmail]['name']}"`; //queryParameter 
}
