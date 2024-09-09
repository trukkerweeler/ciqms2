import { loadHeaderFooter } from './utils.mjs';
loadHeaderFooter();

// Get the project id from the url params
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let iid = urlParams.get('id');
console.log(iid);
    

const url = 'http://localhost:3010/ncm/' + iid;

const main = document.querySelector('main');
// Delete the child nodes of the main element
while (main.firstChild) {
    // if (main.firstChild.nodeName === 'section') {
        main.removeChild(main.firstChild);
        // section.remove();
    // }
}

    // // enable the close button
    // closebutton.disabled = false;

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
            const elemFUP = document.createElement('p');
            elemFUP.setAttribute('id', 'followup');
            // const elemResponse = document.createElement('p');
            // elemResponse.setAttribute('id', 'response');

            const aiDate = document.createElement('p');
            aiDate.textContent = 'Request Date:' + ' ' + record[key]['NCM_DATE'].substring(0, 10);
            aiDate.setAttribute('class', 'tbl');

            const aiClosedDate = document.createElement('p');
            if (record[key]['CLOSED_DATE'] === null || record[key]['CLOSED_DATE'] === '' || record[key]['CLOSED_DATE'].length === 0) {
                aiClosedDate.textContent = 'Closed Date:' + ' ' + '';
                console.log('closed date is null');
            } else {
                aiClosedDate.textContent = 'Closed Date:' + ' ' + record[key]['CLOSED_DATE'].substring(0, 10);
                // enable the closebutton
                // closebutton.disabled = true;
                console.log('closed date is NOT null');
            }
            // toggle display of doit if recur id is not null
            const doit = document.querySelector('#doit');
            if (record[key]['RECUR_ID'] !== null) {
                doit.style.display = 'block';
                console.log('recur id is not null');
            } else {
                doit.style.display = 'none';
                console.log('recur id is null');
            }

            aiClosedDate.setAttribute('class', 'tbl');

            const caAssTo = document.createElement('p');
            caAssTo.textContent = 'Assigned To:' + ' ' + record[key]['ASSIGNED_TO'];
            caAssTo.setAttribute('class', 'tbl');
            const reqBy = document.createElement('p');
            reqBy.textContent = 'Request By:' + ' ' + record[key]['PEOPLE_ID'];
            reqBy.setAttribute('class', 'tbl');

            const due_date = document.createElement('p');
            if (record[key]['DUE_DATE'] === null) {
                due_date.textContent = 'Due date:' + ' ' + '';
            }
            else
                due_date.textContent = 'Due date:' + ' ' + record[key]['DUE_DATE'].substring(0, 10);
            due_date.setAttribute('class', 'tbl');

            const ncmType = document.createElement('p');
            ncmType.textContent = 'Type:' + ' ' + record[key]['NCM_TYPE'];
            ncmType.setAttribute('class', 'tbl');   
            
            const productId = document.createElement('p');
            productId.setAttribute('class', 'tbl');
            if ((record[key]['PRODUCT_ID'] === null) || (record[key]['PRODUCT_ID'] === '') || (record[key]['PRODUCT_ID'] === undefined)) {
                productId.textContent = 'Product Id:' + '--';
            }
            else {
                productId.textContent = 'Product Id:' + ' ' + record[key]['PRODUCT_ID'];
            }

            const notesSection = document.createElement('section');
            notesSection.setAttribute('class', 'notes');

            const ncTrendTitle = document.createElement('h3');
            ncTrendTitle.setAttribute('class', 'header3');
            const dispositionTitle = document.createElement('h3');
            dispositionTitle.setAttribute('class', 'header3');

            const verificationTitle = document.createElement('h3');
            verificationTitle.setAttribute('class', 'header3');
            const linebreak = document.createElement('br');

            elemRpt.textContent = 'Nonconformance Detail';
            elemRpt.setAttribute('class', 'header');
            elemId.textContent = 'NCM Id: ' + record[key]['NCM_ID'];
            elemId.setAttribute('class', 'header2');

            detailSection.appendChild(productId);
            detailSection.appendChild(aiDate);
            detailSection.appendChild(caAssTo);
            detailSection.appendChild(aiClosedDate);
            detailSection.appendChild(reqBy);
            detailSection.appendChild(due_date);
            detailSection.appendChild(ncmType);

            const divTrend = document.createElement('div');
            divTrend.setAttribute('class', 'trend');
            ncTrendTitle.textContent = 'Trend:';
            divTrend.textContent = record[key]['DESCRIPTION'];
            divTrend.setAttribute('id', 'inputtext');
            divTrend.innerHTML = divTrend.innerHTML.replace(/\n/g, '<br>');
            notesSection.appendChild(ncTrendTitle);
            notesSection.appendChild(divTrend);

            const divDisposition = document.createElement('div');
            divDisposition.setAttribute('class', 'disposition');
            dispositionTitle.textContent = 'Disposition:';
            divDisposition.textContent = record[key]['DISPOSITION'];
            divDisposition.innerHTML = divDisposition.innerHTML.replace(/\n/g, '<br>');
            notesSection.appendChild(dispositionTitle);
            notesSection.appendChild(divDisposition);
            
            const divVerification = document.createElement('div');
            divVerification.setAttribute('class', 'verification');
            divVerification.innerHTML = divVerification.innerHTML.replace(/\n/g, '<br>');
            verificationTitle.textContent = 'Verification:';
            divVerification.textContent = record[key]['VERIFICATION'];
            divVerification.innerHTML = divVerification.innerHTML.replace(/\n/g, '<br>');
            notesSection.appendChild(verificationTitle);
            notesSection.appendChild(divVerification);

            // // Manage the closed checkbox
            // const closed = document.createElement('checkbox');
            // // get the value of the checkbox
            // const closedValue = record[key]['CLOSED'];
            // console.log(closedValue);

            main.appendChild(elemRpt);
            main.appendChild(elemId);
            main.appendChild(detailSection);
            main.appendChild(notesSection);
        }
    });
    // toggle enable/disable of the edit button
    // editbutton.disabled = false;
    // closebutton.disabled = true;
