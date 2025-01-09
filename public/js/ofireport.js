import { loadHeaderFooter } from './utils.mjs';
loadHeaderFooter();
document.querySelector('#subjectFilter').addEventListener('keyup', function(event) {
    const filter = event.target.value.toLowerCase();
    const rows = document.querySelectorAll('tbody tr');
    
    rows.forEach(row => {
        const createdCell = row.querySelector('td:nth-child(1)'); // Assuming INPUT_DATE is the first column
        if (createdCell) {
            const year = new Date(createdCell.textContent).getFullYear().toString();
            // const yearText = createdCell.textContent.toLowerCase();
            if (year.includes(filter)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
});

// create url using the port from the environment variable
// const port = process.env.PORT || 3003;
// const port = process.env.PORT || 3010;
const url = `http://localhost:3010/reports/ofi`;

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
            th.textContent = key;
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
                    } else {
                        if (key == 'INPUT_ID') {
                            td.innerHTML = `<a href="http://localhost:3010/input.html?id=${record[key]}">${record[key]}</a>`;
                        } else {
                            td.textContent = record[key];
                        }
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