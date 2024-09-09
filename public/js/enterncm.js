import { loadHeaderFooter } from './utils.mjs';
loadHeaderFooter();

const url = 'http://localhost:3010/ncm';

let recordDate = new Date();
recordDate.setDate(recordDate.getDate());
// let recordDateTime = recordDate
recordDate = recordDate.toISOString().slice(0, 10);
const defaultNcmDate = document.getElementById('NCM_DATE');
defaultNcmDate.value = recordDate;

let myDueDateDefault = new Date();
myDueDateDefault.setDate(myDueDateDefault.getDate() + 14);
myDueDateDefault = myDueDateDefault.toISOString().slice(0, 10);
const defaultDueDate = document.getElementById('DUE_DATE');
defaultDueDate.value = myDueDateDefault;

// Send a POST request
const form = document.querySelector('#ncmform');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const nextId = await fetch(url + '/nextId', { method: 'GET' })
    .then(response => response.json())
    .then (data => {
        JSON.stringify(data);
        return data;
    });
    
    const dataJson = {
        NCM_ID: nextId,
        // Create a now date for the record
        CREATE_DATE: new Date().toISOString(),
        CREATE_BY: 'TKENT',
        CLOSED: 'N',
    };
    for (let field of data.keys()) {
        // console.log(field);
        switch (field) {
            case 'PEOPLE_ID':
                dataJson[field] = data.get(field).toUpperCase();
                break;
            case 'ASSIGNED_TO':
                dataJson[field] = data.get(field).toUpperCase();
                break;
            case 'SUBJECT':
                dataJson[field] = data.get(field).toUpperCase();
                break;
            case 'PROJECT_ID':
                dataJson[field] = data.get(field).toUpperCase();
                break;
            default:
                if (field[field.length - 4] === '_DATE') {
                    let myDate = data.get(field);
                    myDate = myDate.slice(0, 10);
                    dataJson[field] = myDate;
                    // break;
                } else {
                    dataJson[field] = data.get(field);
                }
        }
    }
    
    console.log(dataJson);

    try {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                },
            body: JSON.stringify(dataJson)
        });
        // console.log('Success:', JSON.stringify(dataJson));
        }
        catch (err) {
            console.log('Error:', err);
        }
    
    form.reset();
});
