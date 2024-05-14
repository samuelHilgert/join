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
 * Iterates through the user login process.
 * Checks for success, handles success and failure accordingly.
 * @returns {Promise<void>}
 */
async function iterateUsers() {
    if (successCheck()) {
        await handleSuccess();
    } else {
        handleFailure();
    }
}


/**
 * Handles the success scenario of user login.
 * Sets flags for success email and password,
 * Retrieves user ID by email,
 * Handles remember login option,
 * Displays login message and moves container up.
 * @returns {Promise<void>}
 */
async function handleSuccess() {
    clearLocalStorageFirst();
    successEmail = true;
    successPassword = true;
    indexByEmail = getUserId(loginEmail.value);
    if (loginCheckbox.checked) {
        await handleRememberLogin();
    } else {
        await handleForgetLogin();
    }
    let container = document.getElementById('messageFormLogin');
    showLoginMessage();
    loginMessageDisplay(container);
    moveContainerUp(container);
    setTimeout(forwardToSummary, 1500);
}


/**
 * This function makes sure, that user and guest can not logged in at the same time
 * It cleans the local storage before it will be filled
 */
function clearLocalStorageFirst() {
    localStorage.removeItem('user');
    localStorage.removeItem('logged');
    localStorage.removeItem('remember');
}

/**
 * Handles the failure scenario of user login.
 * Verifies email and password.
 */
function handleFailure() {
    verificateEmail();
    verifcatePassword();
}


/**
 * Handles the process of remembering login credentials.
 * Sets the expiry date, updates the remember status, saves to local storage.
 * @returns {Promise<void>}
 */
async function handleRememberLogin() {
    let expiryDate = new Date().getMinutes() + setExpiryTime;
    remember = true;
    await saveToLocalStorage(expiryDate);
}


/**
 * Handles the process of forgetting login credentials.
 * Resets the remember status, sets the expiry date, saves to local storage.
 * @returns {Promise<void>}
 */
async function handleForgetLogin() {
    remember = false;
    let expiryDate = new Date().getMinutes() + setExpiryTime;
    await saveToLocalStorage(expiryDate);
}


/**
 * Saves user ID and remember status to the local storage, pushes remember status into an array, and updates it on the remote server.
 * @param {number} expiryDate - The expiry date for remembering the login credentials.
 * @returns {Promise<void>}
 */
async function saveToLocalStorage(expiryDate) {
    let id = indexByEmail;
    localStorage.setItem('user', id);
    localStorage.setItem('remember', remember);
    pushRememberStatusInArray(expiryDate);
    await pushRememberStatusOnRemoteServer();
}


/**
 * Pushes remember status into an array.
 * @param {number} expiryDate - The expiry date for remembering the login credentials.
 * @returns {void}
 */
function pushRememberStatusInArray(expiryDate) {
    rememberStatus.push({
        remember_status: remember,
        expiryDate: expiryDate
    });
}


/**
 * Updates remember status on the remote server.
 * @returns {Promise<void>}
 */
async function pushRememberStatusOnRemoteServer() {
    await setItem('remember_status', JSON.stringify(rememberStatus));
}


/**
 * This is a function to check whether email not exists
 * 
 */
function verificateEmail() {
    let container = document.getElementById('messageFormLogin');
    if (emailNotFound() || users.length === 0) {
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
    clearLocalStorageFirst();
    localStorage.setItem('logged', true);
    setTimeout(forwardSummaryAsGuest, 500);
}


/**
 * Redirects the user to the summary page with a message indicating they are logged in as a guest.
 * @returns {void}
 */
function forwardSummaryAsGuest() {
    window.location.href = `./summary.html?msg=Du bist als Gast angemeldet`;
}
