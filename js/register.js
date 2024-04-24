let users = [];
let registerSuccess = false;
let checkbox = false;
let emailExist = false;


/**
 * This function loads all already registered users from remote server
 * 
 */
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * This function checks the individual requirements for successful registration
 * 
 */
function register() {
    let registerBtn = document.getElementById('registerBtn');
    registerBtn.disabled = true; // registerBtn ist die id vom button Absenden
    checkboxClicked();
}

/**
 * This function checks whether the checkbox was clicked by user
 * 
 */
function checkboxClicked() {
    if (signUpCheckbox.checked) {
        checkbox = true;
        checkEmailExist();
    } else {
        showSignUpMessage();
        messageDisplay();
        hideMessageContainer();
        signUpErrorReset();
    }
}

/**
 * This function checks whether email already exist
 * 
 */
function checkEmailExist() {
    if (users.some(user => user.email === registerEmail.value)) {
        emailExist = true;
        registerEmail.value = '';
        showSignUpMessage();
        messageDisplay();
        hideMessageContainer();
        signUpErrorReset();
        // setTimeout(messageDisplayNone, messageDisplayTime);
        //  showSignUpMessage();
    }
    else {
        signUpPasswordsMatched();
    }
}

/**
 * This function checks whether the two passwords match
 * 
 */
function signUpPasswordsMatched() {
    if (password.value === confirmPassword.value) {
        registerSuccess = true;
        pushUserData();
        showSignUpMessage();
        messageDisplay();
        hideMessageContainer();
        resetSingUpForm();
        // showSignUpMessage();
        // setTimeout(backToLogin, 800);
    }
    else {
        showSignUpMessage();
        messageDisplay();
        hideMessageContainer();
        resetSingUpForm();
        // setTimeout(messageDisplayNone, messageDisplayTime);
        // showSignUpMessage();
    }
}

/**
 * This function resets the password values 
 * 
 */
function signUpErrorReset() {
    let registerBtn = document.getElementById('registerBtn');
    password.value = '';
    confirmPassword.value = '';
    registerBtn.disabled = false;
}

/**
 * This function set message display to none
 * 
 */
function messageDisplay() {
    let messageContainer = document.getElementById('messageContainer');
    let container = document.getElementById('messageFormSignUp');
    messageContainer.style.display = 'flex';
    container.style.display = 'flex';
    moveContainerIn(container);
    setTimeout(function () {
        moveContainerOut(container);
    }, 2000);
}

function hideMessageContainer() {
    let messageContainer = document.getElementById('messageContainer');
    let container = document.getElementById('messageFormSignUp');
    // messageContainer.style.display = 'none';
    // container.style.display = 'none';
}

/**
 * If the login requirements are successful, the user data are passed to the "users" array.
 * 
 */
async function pushUserData() {
    pushInArray();
    await pushOnRemoteServer();
}

/**
 * The user data are passed to the "users" array.
 * 
 */
function pushInArray() {
    users.push({
        name: signUpName.value,
        email: registerEmail.value,
        password: password.value
    });
}

/**
 * The user data are passed on the remote server.
 * 
 */
async function pushOnRemoteServer() {
    await setItem('users', JSON.stringify(users));
}

/**
 * This function includes all output messages in the various cases of the register process.
 * 
 */
function showSignUpMessage() {
    let messageFormSignUp = document.getElementById('messageFormSignUp');

    if (registerSuccess === true) {
        messageFormSignUp.innerHTML = 'You Signed Up successfully';
    }
    if (checkbox === false) {
        messageFormSignUp.innerHTML = 'You must accept the privacy policy';
    }
    if (registerSuccess === false && checkbox === true) {
        messageFormSignUp.innerHTML = 'The passwords do not match';
    }
    if (emailExist === true && checkbox === true) {
        messageFormSignUp.innerHTML = 'This email already exists';
    }
}

/**
 * This function resets all values
 * 
 */
function resetSingUpForm() {
    let registerBtn = document.getElementById('registerBtn');
    signUpName.value = '';
    registerEmail.value = '';
    password.value = '';
    confirmPassword.value = '';
    registerBtn.disabled = false;
    registerSuccess = false;
    checkbox = false;
}

/**
 * This function returns the user to login.html with a success message in the URL
 * 
 */
function backToLogin() {
    window.location.href = './login.html?msg=Du hast dich erfolgreich registriert'; // queryParameter 
}


