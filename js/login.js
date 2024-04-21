let successEmail = false;
let successPassword = false;

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
        console.log('Email UND Passwort korrekt');
        successEmail = true;
        successPassword = true;
        showLoginMessage();
    } else {
        if (emailNotFound()) {
            successEmail = false;
            console.log('Email nicht gefunden');
            loginErrorReset();
            showLoginMessage();
        }
        if (onlyEmailCorrect()) {
            successEmail = true;
            successPassword = false;
            console.log('Email korrekt ABER Passwort falsch');
            loginErrorReset();
            showLoginMessage();
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
