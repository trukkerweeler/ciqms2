import { loadHeaderFooter } from "./utils.mjs";
loadHeaderFooter();

const url = 'http://localhost:3010/attendance';

// Send a POST request
const form = document.querySelector('form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const nextId = await fetch(url + '/nextId', { method: 'GET' })
    .then(response => response.json())
    .then (data => {
        JSON.stringify(data);
        return data;
    })
    console.log(nextId);
    const requestDate = new Date();
    requestDate.setDate(requestDate.getDate())
    let myRequestDate = requestDate.toISOString().slice(0, 19).replace('T', ' ');
    
    
    const dataJson = {
        COURSE_ATND_ID: nextId,
        CREATED_DATE: myRequestDate,
        CREATE_BY: 'TKENT',
    };
    for (let field of data.keys()) {
        // change INSTRUCTOR and PEOPLE_ID to uppercase
        if (field === 'INSTRUCTOR' || field === 'PEOPLE_ID') {
            dataJson[field] = data.get(field).toUpperCase();
        } else {
            dataJson[field] = data.get(field);
        }
    } 
    console.log("31" + dataJson);

    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(dataJson)
        });
        console.log('Success:', JSON.stringify(dataJson));
        }
        catch (err) {
            console.log('Error:', err);
        }
    
    // form.reset();
});

// Clear the form
const clear = document.querySelector('#clear');
clear.addEventListener('click', (event) => {
    event.preventDefault();
    form.reset();
});