const STORAGE_TOKEN = 'MU3TF9XZZPG6WRHN43HDM4XULHV4L5L4J71N3YEH'; // token wird groß geschrieben, weil es eine globale const ist, token immer benennen, weil später mehrere unterschiedliche Tokens gibt
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN }; // es wurde eine schnellschreibweise verwendet, eigentlich so key: key, value: value -> Da aber gleich, kann man es weglassen. 
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) }) //  WICHTIG: nicht await vor diesem tag, weil es gesendet wird. return verwenden, um tag später mit await nutzen zu können, method post ist wichtig, um Daten zu versenden.
    .then(res => res.json()); // Da wir immer mit einem json arbeiten wollen, muss es umgewandelt werden. 
    // then ermöglicht die Kurzschreibweise. 
    // .then kann auch in nächster Zeile stehen, muss nicht in selbe.
}

// um die Daten wieder zu bekommen, kann man nicht mit dem payload arbeiten, da dieser nur mit method post zum server übermittelt werden kann
// um die Daten zu bekommen, werden sie über die url mitgegegeben. 
// erstmals mit ? dann für jede weitere Variable wird ein & Zeichen verwendet

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}