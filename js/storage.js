const STORAGE_TOKEN = 'MU3TF9XZZPG6WRHN43HDM4XULHV4L5L4J71N3YEH';
const STORAGE_URL = 'https://remotestoragejoin-default-rtdb.europe-west1.firebasedatabase.app/';


/**
 * This function posts the user data from the login form (from array "users") to the remote server
 * 
 * 
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(res => res.json());
}


/**
 * This function loads the user data from remote server via the url 
 * 
 * 
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}