let successEmail = false;
let successPassword = false;
let indexByEmail;
let setExpiryTime = 2832323;

/**
 * This function is called when the login form is submitted, it checks whether the data matches the registration 
 * 
 */
async function checkLoginAccess() {
    loginBtn.disabled = true;
    await iterateUsers();
}

/**
 * This is a function to check whether email and password are correct
 * 
 */
async function iterateUsers() {
    if (successCheck()) {
        successEmail = true;
        successPassword = true;
        indexByEmail = getUserId(loginEmail.value);
        if (loginCheckbox.checked) {
            let expiryDate = new Date().getMinutes() + setExpiryTime;
            remember = true;
            await saveToLocalStorage(expiryDate);
        }
        else {
            remember = false;
            // expiryDateString = expiryDate.toLocaleString('de-DE')
            let expiryDate = new Date().getMinutes() + setExpiryTime;
            await saveToLocalStorage(expiryDate);
        }
        let container = document.getElementById('messageFormLogin');
        showLoginMessage();
        loginMessageDisplay(container);
        moveContainerUp(container);
        setTimeout(forwardToSummary, 1500);
    } else {
        verificateEmail();
        verifcatePassword();
    }
}

async function saveToLocalStorage(expiryDate) {
    let id = indexByEmail;
    localStorage.setItem('user', id);
    localStorage.setItem('remember', remember);
    pushRememberStatusInArray(expiryDate);
    await pushRememberStatusOnRemoteServer();
}

function pushRememberStatusInArray(expiryDate) {
    rememberStatus.push({
        remember_status: remember,
        expiryDate: expiryDate
    });
}

async function pushRememberStatusOnRemoteServer() {
    await setItem('remember_status', JSON.stringify(rememberStatus));
}

/**
 * This is a function to check whether email not exists
 * 
 */
function verificateEmail() {
    let container = document.getElementById('messageFormLogin');
    if (emailNotFound()) {
        successEmail = false;
        showLoginMessage();
        loginMessageDisplay(container);
        moveContainerUp(container);
        setTimeout(function () {
            moveContainerDown(container);
        }, 1500);
        setTimeout(function () {
            hideLoginMessageContainer(container);
        }, displayMessageTime);
        loginErrorReset();
    }
}

/**
 * This is a function to check whether the email address matches the password
 * 
 */
function verifcatePassword() {
    let container = document.getElementById('messageFormLogin');
    if (onlyEmailCorrect()) {
        successEmail = true;
        successPassword = false;
        showLoginMessage();
        loginMessageDisplay(container);
        moveContainerUp(container);
        setTimeout(function () {
            moveContainerDown(container);
        }, 1500);
        setTimeout(function () {
            hideLoginMessageContainer(container);
        }, displayMessageTime);
        loginErrorReset();
    }
}

/**
 * Displays the login message container and a specified container.
 * @param {HTMLElement} container - The container to display along with the login message container.
 * @returns {void}
 */
function loginMessageDisplay(container) {
    let loginMessageContainer = document.getElementById('loginMessageContainer');
    loginMessageContainer.style.display = 'flex';
    container.style.display = 'flex';
}

/**
 * Hides the login message container and a specified container.
 * @param {HTMLElement} container - The container to hide along with the login message container.
 * @returns {void}
 */
function hideLoginMessageContainer(container) {
    let loginMessageContainer = document.getElementById('loginMessageContainer');
    loginMessageContainer.style.display = 'none';
    container.style.display = 'none';
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
    if (successEmail === false && successPassword === false) {
        messageFormLogin.innerHTML = 'Email not found';
    }
    if (successPassword === false && successEmail === true) {
        messageFormLogin.innerHTML = 'Password is not correct!';
    }
    if (successEmail === true && successPassword === true) {
        messageFormLogin.innerHTML = 'Login successfully';
    }
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
    localStorage.setItem('logged', true);
    setTimeout(forwardSummaryAsGuest, 500);
}

function forwardSummaryAsGuest() {
    window.location.href = `./summary.html?msg=Du bist als Gast angemeldet`;
}