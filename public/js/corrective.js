import { loadHeaderFooter, getUserValue } from "./utils.mjs";
loadHeaderFooter();
const user = await getUserValue();

// Get the id from the url
let urlParams = new URLSearchParams(window.location.search);
let caid = urlParams.get('id');
let url = 'http://localhost:3010/corrective/' + caid;

const main = document.querySelector('main');
const closebutton = document.getElementById('closecorrective');
const editbutton = document.getElementById('editaction');
const button = document.getElementById('detailsearch');

// Delete the child nodes of the main element
while (main.firstChild) {
    main.removeChild(main.firstChild);
}

fetch(url, { method: 'GET' })
.then(response => response.json())
.then(record => {
    // console.log(record);
    for (const key in record) {

        // Detail section=======================================
        const detailSection = document.createElement('section');
        detailSection.setAttribute('class', 'section');
        const elemRpt = document.createElement('h1');
        const elemId = document.createElement('h2');
        elemRpt.textContent = 'Corrective Action Report';
        elemRpt.setAttribute('class', 'header');
        elemId.textContent = 'Corrective Id: ' + record[key]['CORRECTIVE_ID'] + ' - ' + record[key]['TITLE'];
        elemId.setAttribute('class', 'header2');
        const caDate = document.createElement('p');
        caDate.setAttribute('class', 'actiondate');
        if (record[key]['CORRECTIVE_DATE']) {
            caDate.innerHTML = 'Issue Date:' + ' ' + record[key]['CORRECTIVE_DATE'].substring(0, 10);
        } else {
            caDate.innerHTML = 'Issue Date:' + ' ' + '';
        }
        caDate.setAttribute('class', 'tbl');
        const caAssTo = document.createElement('p');
        caAssTo.textContent = 'Assigned To:' + ' ' + record[key]['ASSIGNED_TO'];
        caAssTo.setAttribute('class', 'tbl');
        const caClosedDate = document.createElement('p');
        if (record[key]['CLOSED_DATE'] === null || record[key]['CLOSED_DATE'] === '0000-00-00'|| record[key]['CLOSED_DATE'] === ''|| record[key]['CLOSED_DATE'].length === 0) {
            caClosedDate.textContent = 'Closed Date:' + ' ' + '';
        } else {
            caClosedDate.textContent = 'Closed Date:' + ' ' + record[key]['CLOSED_DATE'].substring(0, 10);
            // closebutton.disabled = true;
        }
        caClosedDate.setAttribute('class', 'tbl');
        const caRef = document.createElement('p');
        caRef.textContent = 'Reference:' + ' ' + record[key]['REFERENCE'];
        caRef.setAttribute('class', 'tbl');
        const reqBy = document.createElement('p');
        reqBy.textContent = 'Request By:' + ' ' + record[key]['REQUEST_BY'];
        reqBy.setAttribute('class', 'tbl');
        const project = document.createElement('p');
        if (record[key]['PROJECT_ID'] === null) {
            project.textContent = 'Project:' + ' ' + '(No project)';
        } else {
            project.textContent = 'Project:' + ' ' + record[key]['PROJECT_ID'];
        }
        project.setAttribute('class', 'tbl');

        // Append the elements to the detail section
        detailSection.appendChild(caDate);
        detailSection.appendChild(caAssTo);
        detailSection.appendChild(caClosedDate);
        detailSection.appendChild(caRef);
        detailSection.appendChild(reqBy);
        detailSection.appendChild(project);


        // Trend section=======================================
        const trendSection = document.createElement('section');
        trendSection.setAttribute('id', 'trendSection');
        const trendHeader = document.createElement('h3');
        trendHeader.textContent = 'NC Trend';
        const trendText = document.createElement('p');
        trendText.textContent = record[key]['NC_TREND'];
        trendText.innerHTML = trendText.innerHTML.replace(/\n/g, '<br>');
        trendSection.appendChild(trendHeader);
        trendSection.appendChild(trendText);


        // Correction section=======================================
        const correctionSection = document.createElement('section');
        correctionSection.setAttribute('id', 'correctionSection');
        const correctionHeader = document.createElement('h3');
        correctionHeader.textContent = 'Correction';
        const correctionText = document.createElement('p');
        correctionText.setAttribute('id', 'correctiontext');
        correctionText.textContent = record[key]['CORRECTION_TEXT'];
        correctionText.innerHTML = correctionText.innerHTML.replace(/\n/g, '<br>');
        const correctionDate = document.createElement('p');
        // correctionDate.setAttribute('class', 'tbl');
        correctionDate.setAttribute('class', 'actiondate');
        if (record[key]['CORRECTION_DATE']) {
            correctionDate.innerHTML = 'Correction Date:' + ' ' + record[key]['CORRECTION_DATE'].substring(0, 10);
        } else {
            correctionDate.innerHTML = 'Correction Date:' + ' ' + '';
        }
        const btnCorrection = document.createElement('button');
        btnCorrection.setAttribute('id', 'btnCorrection');
        btnCorrection.setAttribute('class', 'btnEditNotes');
        btnCorrection.textContent = 'Edit';
        btnCorrection.addEventListener('click', (e) => {
            e.preventDefault();
            // load values to the form
            document.getElementById('correctiontext').value = record[key]['CORRECTION_TEXT'];
            // document.getElementById('correctiondate').value = record[key]['CORRECTION_DATE'];
            // show the dialog
            document.getElementById('correctionDialog').showModal();

            // save the changes
            document.getElementById('correctionSave').addEventListener('click', async (e) => {
                e.preventDefault();
                // get the values from the form
                let correctiontext = document.getElementById('correctiontext').value;
                let newcorrectiontext = document.getElementById('new-correction-text').value;
                let formatteddate = new Date().toISOString();
                formatteddate = formatteddate.replace('T', ' ').substring(0, 19);
                // replace the colon
                formatteddate = formatteddate.replace(':', '');
                newcorrectiontext = user + ' - ' + formatteddate + ': ' + newcorrectiontext;
                let concatText = newcorrectiontext + '\n' + correctiontext;
                console.log(concatText);
                // // let correctiondate = document.getElementById('correctiondate').value;
                // let correctiondate = new Date().toISOString().slice(0, 10);
                // // console.log(correctiontext);
                // // console.log(correctiondate);
                // // console.log(caid);
                // update the record
                let url = 'http://localhost:3010/corrective/' + caid;
                await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        'CORRECTION_TEXT': concatText,
                        // 'CORRECTION_DATE': correctiondate
                    })
                });
                // close the dialog
                document.getElementById('correctionDialog').close();
                // reload the page
                location.reload();
        });
        });

        correctionSection.appendChild(correctionHeader);
        correctionSection.appendChild(correctionDate);
        correctionSection.appendChild(correctionText);
        correctionSection.appendChild(btnCorrection);


        // Cause section=======================================
        const causeSection = document.createElement('section');
        causeSection.setAttribute('id', 'causeSection');
        const causeHeader = document.createElement('h3');
        causeHeader.textContent = 'Cause';
        const causeText = document.createElement('p');
        causeText.setAttribute('id', 'causetext');
        causeText.textContent = record[key]['CAUSE_TEXT'];
        causeText.innerHTML = causeText.innerHTML.replace(/\n/g, '<br>');
        const btnCause = document.createElement('button');
        btnCause.setAttribute('id', 'btnCause');
        btnCause.setAttribute('class', 'btnEditNotes');
        btnCause.textContent = 'Edit';
        causeSection.appendChild(causeHeader);
        causeSection.appendChild(causeText);   
        causeSection.appendChild(btnCause);


        // Control section=======================================
        const controlSection = document.createElement('section');
        controlSection.setAttribute('id', 'controlSection');
        const controlHeader = document.createElement('h3');
        controlHeader.textContent = 'Systemic Remedy';
        const controlText = document.createElement('p');
        controlText.setAttribute('id', 'controltext');
        controlText.textContent = record[key]['CONTROL_TEXT'];        
        controlText.innerHTML = controlText.innerHTML.replace(/\n/g, '<br>');
        const controlDate = document.createElement('p');
        controlDate.setAttribute('class', 'actiondate2');
        if (record[key]['CORR_ACTION_DATE']) {
            controlDate.innerHTML = 'Systemic Date:' + ' ' + record[key]['CORR_ACTION_DATE'].substring(0, 10);
        } else {
            controlDate.innerHTML = 'Systemic Date:' + ' ' + '';
        }
        const btnControl = document.createElement('button');
        btnControl.setAttribute('id', 'btnControl');
        btnControl.setAttribute('class', 'btnEditNotes');
        btnControl.textContent = 'Edit';     
        controlSection.appendChild(controlHeader);
        controlSection.appendChild(controlDate);
        controlSection.appendChild(controlText);
        controlSection.appendChild(btnControl);


        // Append the elements to the main element================
        main.appendChild(elemRpt);
        main.appendChild(elemId);
        main.appendChild(detailSection);
        main.appendChild(trendSection);
        main.appendChild(correctionSection);
        main.appendChild(causeSection);
        main.appendChild(controlSection);
    }
});
