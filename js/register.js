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

async function register() {
    registerBtn.disabled = true; // registerBtn ist die id vom button Absenden
    checkboxClicked();
}

/*
function checkboxClicked() {
    if (checkbox === true) {

        
    } else {

        showMessage();
    }
}
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

function signUpErrorReset() {
    password.value = '';
    confirmPassword.value = '';
    registerBtn.disabled = false;
}

function pushUserData() {
    users.push({
        name: signUpName.value,
        email: email.value,
        password: password.value
    });
    /*  
    await setItem('users', JSON.stringify(users)); 
    */
}

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