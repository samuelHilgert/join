function renderSummary() {
    let userNameDiv = document.getElementById('userNameDiv');
    const savedDataSesssionStorage = sessionStorage.getItem('user');
    const savedDataLocalStorage = localStorage.getItem('user');
    if (savedDataSesssionStorage) {
        let parsedUserData = JSON.parse(savedDataSesssionStorage);
        let parsedUserName = parsedUserData['name'];
        userNameDiv.innerHTML = parsedUserName;
    } else {
        if (savedDataLocalStorage) {
            let parsedUserData = JSON.parse(savedDataLocalStorage);
            let parsedUserName = parsedUserData['name'];
            userNameDiv.innerHTML = parsedUserName;
        } else {
            console.log('Keine Daten gefunden.');
        }
    }
}



