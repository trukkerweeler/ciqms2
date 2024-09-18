import { loadHeaderFooter } from './utils.mjs';
loadHeaderFooter();

const url = 'http://localhost:3002/corrective';

function getRecords () {
    const main = document.querySelector('main');
    
    fetch(url, { method: 'GET' })

    .then(response => response.json())
    .then(records => {
        // console.log(records);
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        const header = document.createElement('tr');
        const td = document.createElement('td');
        
        for (let key in records[0]) {
            // if (fieldList.includes(key)){
            const th = document.createElement('th');
            switch (key) {
                case 'USER_DEFINED_1':
                    th.textContent = 'UD1';
                    break;
                case 'USER_DEFINED_2':
                    th.textContent = 'UD2';
                    break;
                default:
                    th.textContent = key;
                    break;
            }
            header.appendChild(th);
            // }
        }
        thead.appendChild(header);

        for (let record of records) {
            const tr = document.createElement('tr');
            for (let key in record) {
                const td = document.createElement('td');
                // console.log(key.substring(key.length - 4));
                if (key !== null) {
                    if (key.substring(key.length - 4) === 'DATE' && key.length > 0 && record[key] !== null) {
                        td.textContent = record[key].slice(0,10);
                    } else if (key == 'CORRECTIVE_ID') {
                            td.innerHTML = `<a href="http://localhost:3002/corrective.html?id=${record[key]}">${record[key]}</a>`;
                        }
                    else {
                        td.textContent = record[key];                        
                    }
                } else {
                    td.textContent = record[key];
            }
            tr.appendChild(td);
        }
            tbody.appendChild(tr);
        }

        table.appendChild(thead);
        table.appendChild(tbody);
        main.appendChild(table);
    })
}

getRecords();