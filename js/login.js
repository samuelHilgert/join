let successEmail = false;
let successPassword = false;
let indexByEmail;
let remember = false;

/**
 * This function is called when the login form is submitted, it checks whether the data matches the registration 
 * 
 */
async function checkLoginAccess() {
    loginBtn.disabled = true;
    iterateUsers();
}

/**
 * This is a function to check whether email and password are correct
 * 
 */
function iterateUsers() {
    if (successCheck()) {
        successEmail = true;
        successPassword = true;
        indexByEmail = getUserId(loginEmail.value);
        if (loginCheckbox.checked) {
            remember = true;
            saveToLocalStorage();
        }
        else {
            remember = false;
            saveToSessionStorage();
        }
        showLoginMessage();
        setTimeout(forwardToSummary, messageDisplayTime);
    } else {
        verificateEmail();
        verifcatePassword();
    }
}

function saveToSessionStorage() {
    let userName = users[indexByEmail]['name'];
    let userEmail = users[indexByEmail]['email'];
    const user = {
        name: userName,
        email: userEmail
    };
    sessionStorage.setItem('user', JSON.stringify(user));
}

function saveToLocalStorage() {
    let userName = users[indexByEmail]['name'];
    let userEmail = users[indexByEmail]['email'];
    const user = {
        name: userName,
        email: userEmail
    };
    localStorage.setItem('user', JSON.stringify(user));
}

/**
 * This is a function to check whether email not exists
 * 
 */
function verificateEmail() {
    if (emailNotFound()) {
        successEmail = false;
        loginErrorReset();
        showLoginMessage();
        setTimeout(messageDisplayFormLogin, messageDisplayTime);
    }
}

/**
 * This is a function to check whether the email address matches the password
 * 
 */
function verifcatePassword() {
    if (onlyEmailCorrect()) {
        successEmail = true;
        successPassword = false;
        loginErrorReset();
        showLoginMessage();
        setTimeout(messageDisplayFormLogin, messageDisplayTime);
    }
}

/**
 * return result whether email not found
 * 
 */
function emailNotFound() {
    return users.some(user => user.email !== loginEmail.value);
}

/**
 * return result whether login was success
 * 
 */
function successCheck() {
    return users.some(user => user.email === loginEmail.value && user.password === loginPassword.value);
}

/**
 * return result whether only email was correct
 * 
 */
function onlyEmailCorrect() {
    return users.some(user => user.email === loginEmail.value && user.password !== loginPassword.value);
}

/**
 * return index of users array, if email and password were correct
 * 
 */
function getUserId(loggedEmail) {
    const index = users.findIndex(user => user.email === loggedEmail);
    return index;
}

/**
 * This function resets all values
 * 
 */
function loginErrorReset() {
    loginPassword.value = '';
    loginBtn.disabled = false;
}

/**
 * This function includes all output messages in the various cases of the login process.
 * 
 */
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

/**
 * This function allows guest to login without registration before
 * 
 */
function guestLogin() {
    window.location.href = `./summary.html?msg=Du bist als Gast angemeldet`;
}
