import { loadHeaderFooter, getUserValue } from "./utils.mjs";
loadHeaderFooter();
const user = await getUserValue();

// Get the id from the url
let urlParams = new URLSearchParams(window.location.search);
let caid = urlParams.get('id');

const main = document.querySelector('main');
const closebutton = document.getElementById('closecorrective');
const editbutton = document.getElementById('editaction');
const button = document.getElementById('detailsearch');


let url = 'http://localhost:3010/corrective/' + caid;

// Delete the child nodes of the main element
while (main.firstChild) {
    main.removeChild(main.firstChild);
}

fetch(url, { method: 'GET' })
.then(response => response.json())
.then(record => {
    // console.log(record);
    for (const key in record) {
        const detailSection = document.createElement('section');
        detailSection.setAttribute('class', 'section');
        const elemRpt = document.createElement('h1');
        const elemId = document.createElement('h2');
        
        const elemDesc = document.createElement('p');
        const elemIA = document.createElement('p');
        elemIA.setAttribute('id', 'correctiontext');
        const elemIaDate = document.createElement('p');
        const elemCause = document.createElement('p');
        elemCause.setAttribute('id', 'causetext');
        elemIaDate.setAttribute('class', 'actiondate');
        const elemCaDate = document.createElement('p');
        elemCaDate.setAttribute('class', 'actiondate2');
        const elemCC = document.createElement('p');
        elemCC.setAttribute('id', 'controltext');
        const caDate = document.createElement('p');
        if (record[key]['DUE_DATE']) {
            caDate.innerHTML = 'Issue Date:' + ' ' + record[key]['CORRECTIVE_DATE'].substring(0, 10) + '<br>' + 'Due Date:' + ' ' + record[key]['DUE_DATE'].substring(0, 10);
            } else {
                caDate.innerHTML = 'Issue Date:' + ' ' + record[key]['CORRECTIVE_DATE'].substring(0, 10) + '<br>' + 'Due Date:' + ' ' + '';
            }
        caDate.setAttribute('class', 'tbl');
        const caRef = document.createElement('p');
        caRef.textContent = 'Process:' + ' ' + record[key]['REFERENCE'];
        caRef.setAttribute('class', 'tbl');

        const caClosedDate = document.createElement('p');
        if (record[key]['CLOSED_DATE'] === null || record[key]['CLOSED_DATE'] === '0000-00-00'|| record[key]['CLOSED_DATE'] === ''|| record[key]['CLOSED_DATE'].length === 0) {
            caClosedDate.textContent = 'Closed Date:' + ' ' + '';
        } else {
            caClosedDate.textContent = 'Closed Date:' + ' ' + record[key]['CLOSED_DATE'].substring(0, 10);
            closebutton.disabled = true;
        }
            
        caClosedDate.setAttribute('class', 'tbl');        
        
        const caAssTo = document.createElement('p');
        caAssTo.textContent = 'Assigned To:' + ' ' + record[key]['ASSIGNED_TO'];
        caAssTo.setAttribute('class', 'tbl');
        const reqBy = document.createElement('p');
        reqBy.textContent = 'Request By:' + ' ' + record[key]['REQUEST_BY'];
        reqBy.setAttribute('class', 'tbl');
        const caType = document.createElement('p');
        caType.textContent = 'Type:' + ' ' + record[key]['TYPE'];
        caType.setAttribute('class', 'tbl');
        const project = document.createElement('p');
        if (record[key]['PROJECT_ID'] === null) {
            project.textContent = 'Project:' + ' ' + '(No project)';
        } else {
            project.textContent = 'Project:' + ' ' + record[key]['PROJECT_ID'];
        }
        project.setAttribute('class', 'tbl');
        
        const ncTrendTitle = document.createElement('h3');
        const correctionTrendTitle = document.createElement('h3');
        const causeTitle = document.createElement('h3');
        const controlTextTitle = document.createElement('h3');
        const linebreak = document.createElement('br');

        elemRpt.textContent = 'Corrective Action Report';
        elemRpt.setAttribute('class', 'header');
        elemId.textContent = 'Corrective Id: ' + record[key]['CORRECTIVE_ID'] + ' - ' + record[key]['TITLE'];
        elemId.setAttribute('class', 'header2');

        detailSection.appendChild(caDate);
        detailSection.appendChild(caAssTo);
        detailSection.appendChild(caClosedDate);
        detailSection.appendChild(caRef);
        detailSection.appendChild(reqBy);
        detailSection.appendChild(project);

        ncTrendTitle.textContent = 'NC Trend';
        elemDesc.textContent = record[key]['NC_TREND'];
        correctionTrendTitle.textContent = 'Correction';
        if (record[key]['CORRECTION_DATE'] === null) {
            elemIaDate.textContent = 'Correction date:' + ' ' + 'Not yet';
        } else
            elemIaDate.textContent = 'Correction date:' + ' ' + record[key]['CORRECTION_DATE'].substring(0, 10);
        elemIA.textContent = record[key]['CORRECTION_TEXT'];
        // replace the line breaks with <br> elements
        elemIA.innerHTML = elemIA.innerHTML.replace(/\n/g, '<br>');
        causeTitle.textContent = 'Cause';
        elemCause.textContent = record[key]['CAUSE_TEXT'];
        // replace the line breaks with <br> elements
        elemCause.innerHTML = elemCause.innerHTML.replace(/\n/g, '<br>');
        controlTextTitle.textContent = 'Systemic Remedy';
        if (record[key]['CORR_ACTION_DATE'] === null) {
            elemCaDate.textContent = 'Systemic date:' + ' ' + 'Not yet';
        } else {
            elemCaDate.textContent = 'Systemic date:' + ' ' + record[key]['CORR_ACTION_DATE'].substring(0, 10);
        }
        elemCC.textContent = record[key]['CONTROL_TEXT'];
        // replace the line breaks with <br> elements
        elemCC.innerHTML = elemCC.innerHTML.replace(/\n/g, '<br>');

        main.appendChild(elemRpt);
        main.appendChild(elemId);
        main.appendChild(detailSection);

        detailSection.appendChild(ncTrendTitle);
        detailSection.appendChild(elemDesc);
        detailSection.appendChild(correctionTrendTitle);
        detailSection.appendChild(elemIA);
        detailSection.appendChild(elemIaDate);

        detailSection.appendChild(causeTitle);
        detailSection.appendChild(elemCause);

        detailSection.appendChild(controlTextTitle);
        detailSection.appendChild(elemCaDate);
        detailSection.appendChild(elemCC);
        main.appendChild(detailSection);
    }
});
