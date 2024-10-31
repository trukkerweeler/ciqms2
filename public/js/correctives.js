
import { loadHeaderFooter } from "./utils.mjs";
loadHeaderFooter();

let sortOrder = 'asc';


const url = 'http://localhost:3010/corrective';

document.addEventListener('DOMContentLoaded', () => {
    fetch(url, {method: 'GET'})
        .then(response => response.json())
        .then(data => {
            createTable(data);
        })
        .catch(error => console.error('Error fetching data:', error));

});

function createTable(data) {
    const table = document.createElement('table');
    const headers = Object.keys(data[0]);
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Create table headers
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.addEventListener('click', () => sortTable(table, header));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table rows
    data.forEach(item => {
        const row = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            // if the word 'date' is in the header, format the date
            if (header.toLowerCase().includes('date')) {
                td.textContent = new Date(item[header]).toLocaleDateString();
            } else if (header == 'CORRECTIVE_ID') {
                td.innerHTML = `<a href="http://localhost:3010/corrective.html?id=${item[header]}">${item[header]}</a>`;
            } else {
                td.textContent = item[header];
            }
            row.appendChild(td);
        });
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Append the table to the main element
    document.querySelector('main').appendChild(table);
}


function sortTable(table, column) {
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const columnIndex = Array.from(table.querySelectorAll('th')).findIndex(th => th.textContent === column);
    const sortedRows = rows.sort((a, b) => {
        const aText = a.children[columnIndex].textContent;
        const bText = b.children[columnIndex].textContent;
        return sortOrder === 'asc' ? aText.localeCompare(bText) : bText.localeCompare(aText);
    });

    const tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    sortedRows.forEach(row => tbody.appendChild(row));

    // Toggle sort order for next click
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
}

// import { loadHeaderFooter } from './utils.mjs';
// loadHeaderFooter();

// const url = 'http://localhost:3010/corrective';

// function getRecords () {
//     const main = document.querySelector('main');
    
//     fetch(url, { method: 'GET' })

//     .then(response => response.json())
//     .then(records => {
//         // console.log(records);
//         const table = document.createElement('table');
//         const thead = document.createElement('thead');
//         const tbody = document.createElement('tbody');
//         const header = document.createElement('tr');
//         const td = document.createElement('td');
        
//         for (let key in records[0]) {
//             // if (fieldList.includes(key)){
//             const th = document.createElement('th');
//             switch (key) {
//                 case 'USER_DEFINED_1':
//                     th.textContent = 'UD1';
//                     break;
//                 case 'USER_DEFINED_2':
//                     th.textContent = 'UD2';
//                     break;
//                 default:
//                     th.textContent = key;
//                     break;
//             }
//             header.appendChild(th);
//             // }
//         }
//         thead.appendChild(header);

//         for (let record of records) {
//             const tr = document.createElement('tr');
//             for (let key in record) {
//                 const td = document.createElement('td');
//                 // console.log(key.substring(key.length - 4));
//                 if (key !== null) {
//                     if (key.substring(key.length - 4) === 'DATE' && key.length > 0 && record[key] !== null) {
//                         td.textContent = record[key].slice(0,10);
//                     } else if (key == 'CORRECTIVE_ID') {
//                             td.innerHTML = `<a href="http://localhost:3010/corrective.html?id=${record[key]}">${record[key]}</a>`;
//                         }
//                     else {
//                         td.textContent = record[key];                        
//                     }
//                 } else {
//                     td.textContent = record[key];
//             }
//             tr.appendChild(td);
//         }
//             tbody.appendChild(tr);
//         }

//         table.appendChild(thead);
//         table.appendChild(tbody);
//         main.appendChild(table);
//     })
// }

// getRecords();