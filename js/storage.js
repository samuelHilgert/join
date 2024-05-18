// const STORAGE_TOKEN = 'MU3TF9XZZPG6WRHN43HDM4XULHV4L5L4J71N3YEH';        without firebase
const STORAGE_URL = 'https://remotestoragejoin-default-rtdb.europe-west1.firebasedatabase.app/';


/**
 * This function sends user data from the login form (from the "users" array) to the remote server.
 * @param {*} key - 
 * @param {*} value - 
 * @returns 
 */
/*
async function setItem(key, value) {
  const url = ${STORAGE_URL}/${key}.json;
  return fetch(url, {
    method: "PUT", // Use PUT to create or replace data at a specific location
    body: JSON.stringify(value), // Just the value, no need for a payload object
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => res.json());
} */


/**
 * This function loads user data from the remote server via the URL
 * @param {*} key - 
 * 
 */
async function getItem(key) {
let responsive = (await fetch(STORAGE_URL)).json();
console.log(responsive);
}


/**
 * This function posts the user data from the login form (from array "users") to the remote server
 * 
 * 
 */
/* without firebase
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
    .then(res => res.json());
} */ 



/**
 * This function loads the user data from remote server via the url 
 * 
 * 
 */
/* without firebase
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}*/