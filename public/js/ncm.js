import { loadHeaderFooter, getUserValue } from './utils.mjs';
loadHeaderFooter();
const user = await getUserValue();

const test = true

// Get the project id from the url params
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let iid = urlParams.get('id');
if (test) {
    console.log(iid);
    }
    

const url = 'http://localhost:3010/ncm/' + iid;

const main = document.querySelector('main');
// Delete the child nodes of the main element
while (main.firstChild) {
        main.removeChild(main.firstChild);
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
            detailSection.setAttribute('id', 'detailSection');
            const elemRpt = document.createElement('h1');
            const elemId = document.createElement('h2');
            const detailHeading = document.createElement('h3');
            detailHeading.textContent = 'Detail';
            
            const ncmDate = document.createElement('p');
            ncmDate.textContent = 'Request Date:' + ' ' + record[key]['NCM_DATE'].substring(0, 10);
            ncmDate.setAttribute('class', 'tbl');

            const aiClosedDate = document.createElement('p');
            if (record[key]['CLOSED_DATE'] === null || record[key]['CLOSED_DATE'] === '' || record[key]['CLOSED_DATE'].length === 0) {
                aiClosedDate.textContent = 'Closed Date:' + ' ' + '';
                if (test) {
                    console.log('closed date is null');
                }
            } else {
                aiClosedDate.textContent = 'Closed Date:' + ' ' + record[key]['CLOSED_DATE'].substring(0, 10);
                // enable the closebutton
                // closebutton.disabled = true;
                console.log('closed date is NOT null');
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

            const lotNumber = document.createElement('p');
            lotNumber.setAttribute('class', 'tbl');
            lotNumber.setAttribute('id', 'lotNumber');
            if ((record[key]['LOT_NUMBER'] === null) || (record[key]['LOT_NUMBER'] === '') || (record[key]['LOT_NUMBER'] === undefined)) {
                lotNumber.textContent = 'Lot Number:' + '--';
            }
            else {
                lotNumber.textContent = 'Lot Number:' + ' ' + record[key]['LOT_NUMBER'];
            }

            const lotQty = document.createElement('p');
            lotQty.setAttribute('class', 'tbl');
            lotQty.setAttribute('id', 'lotQty');
            if ((record[key]['LOT_SIZE'] === null) || (record[key]['LOT_SIZE'] === '') || (record[key]['LOT_SIZE'] === undefined)) {
                lotQty.textContent = 'Lot Qty:' + '';
            }
            else {
                lotQty.textContent = 'Lot Qty:' + ' ' + record[key]['LOT_SIZE'];
            }
            
            const rmaId = document.createElement('p');
            rmaId.textContent = 'RMA Id:' + ' ' + record[key]['USER_DEFINED_1'];
            rmaId.setAttribute('class', 'tbl');
            if ((record[key]['USER_DEFINED_1'] === null) || (record[key]['USER_DEFINED_1'] === '') || (record[key]['USER_DEFINED_1'] === undefined)) {
                rmaId.textContent = 'RMA Id:' + '--';
            } else {
                rmaId.textContent = 'RMA Id:' + ' ' + record[key]['USER_DEFINED_1'];
            }


            const notesSection = document.createElement('section');
            notesSection.setAttribute('class', 'notesgrid');
            notesSection.setAttribute('id', 'notesSection');

            const ncDescTitle = document.createElement('h3');
            ncDescTitle.setAttribute('class', 'header3');
            ncDescTitle.setAttribute('id', 'trendTitle');
            
            const btnEditTrend = document.createElement('button');
            btnEditTrend.setAttribute('class', 'btn');
            btnEditTrend.setAttribute('class', 'btnEditNotes');
            btnEditTrend.setAttribute('id', 'btnEditTrend');
            btnEditTrend.setAttribute('type', 'submit');
            btnEditTrend.textContent = 'Edit Desc.';
            
            const dispositionTitle = document.createElement('h3');
            dispositionTitle.setAttribute('class', 'header3');
            
            const btnEditDisposition = document.createElement('button');
            btnEditDisposition.setAttribute('class', 'btn');
            btnEditDisposition.setAttribute('class', 'btnEditNotes');
            btnEditDisposition.setAttribute('id', 'btnEditDisp');
            btnEditDisposition.textContent = 'Edit Disp.';

            const verificationTitle = document.createElement('h3');
            verificationTitle.setAttribute('class', 'header3');

            const btnEditVerf = document.createElement('button');
            btnEditVerf.setAttribute('class', 'btn');
            btnEditVerf.setAttribute('class', 'btnEditNotes');
            btnEditVerf.setAttribute('id', 'btnEditVerf');
            btnEditVerf.textContent = 'Edit Verf.';            

            const linebreak = document.createElement('br');

            elemRpt.textContent = 'Nonconformance Detail';
            elemRpt.setAttribute('class', 'header');
            elemId.textContent = 'NCM Id: ' + record[key]['NCM_ID'];
            elemId.setAttribute('class', 'header2');
            elemId.setAttribute('id', 'nid');
            
            detailSection.appendChild(detailHeading);
            detailSection.appendChild(productId);
            detailSection.appendChild(ncmDate);
            detailSection.appendChild(caAssTo);
            detailSection.appendChild(aiClosedDate);
            detailSection.appendChild(reqBy);
            detailSection.appendChild(due_date);
            detailSection.appendChild(ncmType);
            detailSection.appendChild(lotNumber);
            detailSection.appendChild(lotQty);
            detailSection.appendChild(rmaId);

            const divDesc = document.createElement('div');
            divDesc.setAttribute('class', 'notes');
            ncDescTitle.textContent = 'Description:';
            divDesc.textContent = record[key]['DESCRIPTION'];
            divDesc.setAttribute('id', 'inputtext');
            divDesc.innerHTML = divDesc.innerHTML.replace(/\n/g, '<br>');
            notesSection.appendChild(ncDescTitle);
            notesSection.appendChild(divDesc);
            notesSection.appendChild(btnEditTrend);

            const divDisposition = document.createElement('div');
            divDisposition.setAttribute('class', 'disposition');
            divDisposition.setAttribute('class', 'notes');
            divDisposition.setAttribute('id', 'disptext');
            dispositionTitle.textContent = 'Disposition:';
            dispositionTitle.setAttribute('id', 'dispTitle');
            if ((record[key]['DISPOSITION'] === null) || (record[key]['DISPOSITION'] === '') || (record[key]['DISPOSITION'] === undefined)) {
                divDisposition.innerHTML = '<br>';
            } else {
                divDisposition.textContent = record[key]['DISPOSITION'];
                divDisposition.innerHTML = divDisposition.innerHTML.replace(/\n/g, '<br>');
            }
            notesSection.appendChild(dispositionTitle);
            notesSection.appendChild(divDisposition);
            notesSection.appendChild(btnEditDisposition);
            
            const divVerification = document.createElement('div');
            divVerification.setAttribute('class', 'verification');
            divVerification.setAttribute('class', 'notes');
            divVerification.setAttribute('id', 'verftext');
            verificationTitle.textContent = 'Verification:';
            verificationTitle.setAttribute('id', 'verificationTitle');
            divVerification.innerHTML = divVerification.innerHTML.replace(/\n/g, '<br>');
            if ((record[key]['VERIFICATION'] === null) || (record[key]['VERIFICATION'] === '') || (record[key]['VERIFICATION'] === undefined)) {
                divVerification.innerHTML = '<br>';
            } else {
                divVerification.textContent = record[key]['VERIFICATION'];
                divVerification.innerHTML = divVerification.innerHTML.replace(/\n/g, '<br>');
            }            
            notesSection.appendChild(verificationTitle);
            notesSection.appendChild(divVerification);
            notesSection.appendChild(btnEditVerf);

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

        // =============================================
        // Listen for the btnEditTrend button click
        const btnEditTrend = document.querySelector('#btnEditTrend');
        btnEditTrend.addEventListener('click', async (event) => {
            // prvent the default action
            event.preventDefault();
            // show the trend dialog
            const trendDialog = document.querySelector('#trendDialog');
            trendDialog.showModal();
        });

    // Listen for the btnEditDisposition button click
    const btnEditDisposition = document.querySelector('#btnEditDisp');
    btnEditDisposition.addEventListener('click', async (event) => {
        // prvent the default action
        event.preventDefault();
        // show the trend dialog
        const dispositionDialog = document.querySelector('#dispDialog');
        dispositionDialog.showModal();
    }
    );

    // =============================================
    // Listen for the btnEditVerf button click
    const btnEditVerf = document.querySelector('#btnEditVerf');
    btnEditVerf.addEventListener('click', async (event) => {
        // prvent the default action
        event.preventDefault();
        // show the trend dialog
        const verfDialog = document.querySelector('#verfDialog');
        verfDialog.showModal();
    }
    );


    // =============================================
    // Listen for click on close dialog button class
    const closedialog = document.querySelectorAll('.closedialog');
    closedialog.forEach((element) => {
        element.addEventListener('click', async (event) => {
            // prevent the default action
            event.preventDefault();
            // close the dialog
            const dialog = element.closest('dialog');
            dialog.close();
        });        
    });

    // // =============================================
    // // Listen for the saveNotes button class
    const saveNotes = document.querySelectorAll('.dialogSaveBtn');
    saveNotes.forEach((element) => {
        element.addEventListener('click', async (event) => {
            // prevent the default action
            event.preventDefault();
            // get the clicked button id
            // get the input id
            const nid = document.querySelector('#nid');
            let nidValue = iid;
            // if (nidValue.length === 0) {
            //     alert('Please enter the Input ID');
            // } else {
            //     while (nidValue.length < 7) {
            //         nidValue = '0' + nidValue;
            //     }
            // }

            const fieldname = event.target.id;

            if (test) {
                console.log(fieldname);
                console.log(nidValue);
                }
            
            let data = {
                NCM_ID: nidValue,
                INPUT_USER: getUserValue(),
            };
            // console.log(data);
    
            let compositetext = '';
            const d = new Date();
            const date = d.toISOString().substring(0, 10);
            const time = d.toLocaleTimeString();
            const mydate = date + ' ' + time;
    
            switch (fieldname) {
                case 'savetrend':
                    // console.log('input text');
                    let previoustext = document.querySelector('#inputtext').innerHTML;
                    let newtextTrend = document.querySelector('#newtextTrend').value;
                    if (length(newtextTrend) === 0) {
                        alert('Not saving, no trend text.');
                        break
                    } else {

                    let compositetext = user + " - " + mydate + "<br>" + document.querySelector('#newtextTrend').value  + "<br><br>" + previoustext;
                    data = { ...data, DESCRIPTION: compositetext}
                    data = { ...data, MY_TABLE: 'NCM_DESCRIPTION'}
                    }
                    break;

                case 'saveDisp':
                    // console.log('followup text');
                    let previoustext2 = document.querySelector('#disptext').innerHTML;
                    let newtextDisp = document.querySelector('#newtextDisp').value;
                    if (newtextDisp.length === 0) {
                        alert('Not saving, no disposition text.');
                        break;
                    } else {
                    let compositetext2 = user + " - " + mydate + "<br>" + document.querySelector('#newtextDisp').value + "<br><br>" + previoustext2;
                    data = { ...data, DISPOSITION: compositetext2}
                    data = { ...data, MY_TABLE: 'NCM_DISPOSITION'}
                    }
                    break;

                case 'saveVerf':
                    let previoustext3 = document.querySelector('#verftext').innerHTML;
                    let newtextVerf = document.querySelector('#newtextVerf').value;
                    if (newtextVerf.length === 0) {
                        alert('Not saving, no verification text.');
                        break;
                    } else {
                        let compositetext3 = user + " - " + mydate + "<br>" + document.querySelector('#newtextVerf').value + "<br><br>" + previoustext3;
                        data = { ...data, VERIFICATION: compositetext3}
                        data = { ...data, MY_TABLE: 'NCM_VERIFICATION'}
                    }                    
                    break;
                
                default:
                    console.log('default');
            }
    
            if (test) {
                console.log(data);
            }
    
            const options = {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            };
    
            const response = await fetch(url, options);
            const json = await response.json();
            // searchbutton.click();  
            trendDialog.close();
            // refresh the page
            window.location.reload();
        });             
        });
    });