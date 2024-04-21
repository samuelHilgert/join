let users = [];
let registerSuccess = false;
let checkbox = false;

/*
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}*/

/**
 * This function checks the individual requirements for successful registration
 * 
 */
async function register() {
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
        signUpPasswordsMatched();
    } else {
        signUpErrorReset();
        showSignUpMessage();
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
        resetSingUpForm();
        setTimeout(backToLogin, 800);
    }
    else {
        signUpErrorReset();
        showSignUpMessage();
    }
}

/**
 * This function resets the password values 
 * 
 */
function signUpErrorReset() {
    password.value = '';
    confirmPassword.value = '';
    registerBtn.disabled = false;
}

/**
 * If the login requirements are successful, the user data are passed to the "users" array.
 * 
 */
function pushUserData() {
    pushInArray();
    // pushOnRemoteServer();
}

/**
 * The user data are passed to the "users" array.
 * 
 */
function pushInArray() {
    users.push({
        name: signUpName.value,
        email: email.value,
        password: password.value
    });
}

/**
 * The user data are passed on the remote server.
 * 
 */
/*
function pushOnRemoteServer() {
    await setItem('users', JSON.stringify(users)); 
}*/

/**
 * This function includes all output messages in the various cases of the register process.
 * 
 */
function showSignUpMessage() {
    let messageFormSignUp = document.getElementById('messageFormSignUp');
    messageFormSignUp.style.display = 'flex';
    if (registerSuccess === true) {
        messageFormSignUp.innerHTML = 'You Signed Up successfully';
    }
    if (checkbox === false) {
        messageFormSignUp.innerHTML = 'You must accept the privacy policy';
    }
    if (registerSuccess === false && checkbox === true) {
        messageFormSignUp.innerHTML = 'The passwords do not match';
    }
}

/**
 * This function resets all values
 * 
 */
function resetSingUpForm() {
    signUpName.value = '';
    email.value = '';
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