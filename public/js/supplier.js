import { loadHeaderFooter } from "./utils.mjs";
loadHeaderFooter();

// Send POST request to server
const form = document.querySelector('#supplierform');
const url = 'http://localhost:3010/suppliers';
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const requestDate = new Date();
    requestDate.setDate(requestDate.getDate())
    let createDate = requestDate.toISOString().slice(0, 19).replace('T', ' ');

    const dataJson = {
        CREATE_DATE: createDate,
        CREATE_BY: 'TKENT',
        SUPP_CONT_NO: '1',
    };
    for (let field of data.keys()) {
        let fieldId = field.split('_');
        switch (fieldId[fieldId.length - 1]) {
            case 'SUPPLIER_ID':
                dataJson[field] = data.get(field).toUpperCase();
                break;
            case 'STATE':
                dataJson[field] = data.get(field).toUpperCase();
                break;
            case 'SCOPE':
                dataJson[field] = data.get(field).toUpperCase();
                break;
            default:
                dataJson[field] = data.get(field);
                break;
        }
    }

    // console.log(dataJson);

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



