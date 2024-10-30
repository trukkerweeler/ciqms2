import { loadHeaderFooter } from "./utils.mjs";
loadHeaderFooter();

let sortOrder = 'asc';


const url = 'http://localhost:3010/attendance';

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