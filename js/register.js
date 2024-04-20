let users = [];

/*
async function loadUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}*/

let registerSuccess = false;
let checkbox = false;

async function register() {
    registerBtn.disabled = true; // registerBtn ist die id vom button Absenden
    let userPassword = document.getElementById('password').value;
    let userConfirmPsassword = document.getElementById('confirmPassword').value;
    if (signUpCheckbox) {
        checkbox = true;
    }

    if (checkbox === true) {
        if (userPassword === userConfirmPsassword) {
            registerSuccess = true;
            pushUserData();
            // Weiterleitung zu login.html 
            // windows.location.href = './login.html?msg=Du hast dich erfolgreich registriert' // queryParameter 
            showMessage();
            resetForm();
        }
        else {
            registerBtn.disabled = false;
            registerSuccess = false;
            password.value = '';
            confirmPassword.value = '';
            showMessage();
        }
    } else {
        checkbox = false;
        showMessage();
    }

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

function resetForm() {
    signUpName.value = '';
    email.value = '';
    password.value = '';
    confirmPassword.value = '';
    registerBtn.disabled = false;
    registerSuccess = false;
    checkbox = false;
}

function showMessage() {
    let messageFormSignUp = document.getElementById('messageFormSignUp');
    if (registerSuccess === true) {
        messageFormSignUp.style.display = 'flex';
        messageFormSignUp.innerHTML = 'You Signed Up successfully';
    }  
    if (checkbox === false) {
        messageFormSignUp.style.display = 'flex';
        messageFormSignUp.innerHTML = 'You must accept the privacy policy';
    }
    if (registerSuccess === false && checkbox === true) {
        messageFormSignUp.style.display = 'flex';
        messageFormSignUp.innerHTML = 'The passwords do not match';
        // messageFormSignUp.style.display = 'none';
    }
}