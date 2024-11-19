import { loadHeaderFooter, getUserValue } from "./utils.mjs";
loadHeaderFooter();
const user = await getUserValue();
const test = true;

// Get the project id from the url params
let queryString = window.location.search;
let urlParams = new URLSearchParams(queryString);
let drid = urlParams.get("id");

// if (test) {
//     console.log('testing requests.js');
//     console.log('User: ' + user);
//     console.log(drid);
// }

const url = "http://localhost:3010/requests/" + drid;

const main = document.querySelector("main");
// Delete the child nodes of the main element
while (main.firstChild) {
  main.removeChild(main.firstChild);
}

// // enable the close button
// closebutton.disabled = false;

fetch(url, { method: "GET" })
  .then((response) => response.json())
  .then((record) => {
    // console.log(record);
    for (const key in record) {
      const detailSection = document.createElement("section");
      detailSection.setAttribute("class", "section");
      detailSection.setAttribute("id", "detailSection");
      const elemRpt = document.createElement("h1");
      const elemId = document.createElement("h2");
      const detailHeading = document.createElement("h3");
      detailHeading.setAttribute("id", "detailTitle");
      detailHeading.textContent = "Request Detail";

      const divDetailBtns = document.createElement("div");
      divDetailBtns.setAttribute("class", "detailButtons");
      divDetailBtns.setAttribute("id", "detailButtons");

      const btnEditReq = document.createElement("button");
      btnEditReq.setAttribute("class", "btn");
      btnEditReq.setAttribute("class", "btnEditNotes");
      btnEditReq.textContent = "Edit";
      btnEditReq.setAttribute("id", "btnEditReq");
      btnEditReq.setAttribute("type", "submit");

      const btnClose = document.createElement("button");
      btnClose.setAttribute("class", "btn");
      // btnClose.setAttribute('class', 'btnEditNotes');
      btnClose.textContent = "Close";
      btnClose.setAttribute("id", "btnCloseNCM");
      btnClose.setAttribute("type", "submit");

      // let detailTable = document.createElement('table');
      // let thead = document.createElement('thead');
      detailSection.appendChild(detailHeading);
      // divDetailBtns.appendChild(btnClose);
      divDetailBtns.appendChild(btnEditReq);
      detailSection.appendChild(divDetailBtns);

      const fieldList = [
        "REQUEST_ID",
        "REQUEST_DATE",
        "ASSIGNED_TO",
        "DUE_DATE",
        "DOCUMENT_ID",
        "DOC_CHG_REG_TXT",
      ];
      for (const key in record[0]) {
        if (fieldList.includes(key)) {
          const p = document.createElement("p");
          p.setAttribute("class", "docdata");
          switch (key) {
            case "REQUEST_DATE":
              p.textContent = "Request Date: " + record[0][key].slice(0, 10);
              break;
            case "DUE_DATE":
              p.textContent = "Due Date: " + record[0][key].slice(0, 10);
              break;
            case "REVISION_LEVEL":
              p.textContent = "Rev. " + record[0][key];
              break;
            default:
              if (record[0][key] === null) {
                p.textContent = key + ": ";
              } else {
                p.textContent = key + ": " + record[0][key];
              }
          }
          detailSection.appendChild(p);
          main.appendChild(detailSection);
        }
      }

      if (user === "TKENT") {
        btnClose.disabled = false;
      } else {
        btnClose.disabled = true;
      }

      // Make request section
      const requestSection = document.createElement("section");
      requestSection.setAttribute("class", "notesgrid");
      requestSection.setAttribute("id", "requestSection");
      const requestHeading = document.createElement("h3");
      requestHeading.setAttribute("id", "requestTitle");
      requestHeading.textContent = "Request Text";
      requestSection.appendChild(requestHeading);
      const requestText = document.createElement("p");
      requestText.setAttribute("id", "requestText");
      requestText.textContent = record[key]["REQUEST_TEXT"];
      //   add edit button
      const btnEditText = document.createElement("button");
      btnEditText.setAttribute("class", "btn");
      btnEditText.setAttribute("class", "btnEditNotes");
      btnEditText.textContent = "Edit";
      btnEditText.setAttribute("id", "btnEditText");
      btnEditText.setAttribute("type", "submit");

      requestSection.appendChild(requestText);
      requestSection.appendChild(btnEditText);

      //   Make response section
      const responseSection = document.createElement("section");
      responseSection.setAttribute("class", "notesgrid");
      responseSection.setAttribute("id", "responseSection");
      const responseHeading = document.createElement("h3");
      responseHeading.setAttribute("id", "responseTitle");
      responseHeading.textContent = "Response Text";
      responseSection.appendChild(responseHeading);
      const responseText = document.createElement("p");
      responseText.setAttribute("id", "responseText");
      if (record[key]["RESPONSE_TEXT"] === null) {
        // responseText.innerHTML = "<em>No response text.</em>";
        responseText.innerHTML = "";
      } else {
        responseText.innerHTML = record[key]["RESPONSE_TEXT"];
      }
      //   add edit button
      const btnEditResp = document.createElement("button");
      btnEditResp.setAttribute("class", "btn");
      btnEditResp.setAttribute("class", "btnEditNotes");
      btnEditResp.textContent = "Edit";
      btnEditResp.setAttribute("id", "btnEditResp");
      btnEditResp.setAttribute("type", "submit");

      responseSection.appendChild(responseText);
      responseSection.appendChild(btnEditResp);

      main.appendChild(elemRpt);
      main.appendChild(elemId);
      main.appendChild(detailSection);
      main.appendChild(requestSection);
      main.appendChild(responseSection);
    }



    // =============================================
    // Listen for click on close dialog button class
    const closedialog = document.querySelectorAll(".closedialog");
    closedialog.forEach((element) => {
      element.addEventListener("click", async (event) => {
        // prevent the default action
        event.preventDefault();
        // close the dialog
        const dialog = element.closest("dialog");
        dialog.close();
      });
    });

    // =============================================
    // Listen for the editEditReq button
    const editDetail = document.querySelector("#btnEditReq");
    editDetail.addEventListener("click", async (event) => {
      const requestDialog = document.querySelector("#requestDialog");
      const detailDialogForm = document.querySelector("#editdocform");
      const label = document.createElement("label");
      // prevent the default action
      event.preventDefault();

      // Clear the dialog
      while (requestDialog.firstChild) {
        requestDialog.removeChild(requestDialog.firstChild);
      }

      for (const key in record) {
        for (const field in record[key]) {
          if (["REQUEST_DATE", "ASSIGNED_TO", "DUE_DATE"].includes(field)) {
            // console.log(field);
            const fieldDesc = document.createElement("label");
            fieldDesc.textContent = field;
            requestDialog.appendChild(fieldDesc);
            const formfield = document.createElement("input");
            formfield.setAttribute("type", "text");
            formfield.setAttribute("id", field);
            formfield.setAttribute("class", "field");
            formfield.setAttribute("class", "detailedit");
            // if null, set the value to empty string
            if (record[key][field] === null) {
              formfield.setAttribute("value", "");
            } else {
              // if the last 4 of field is 'DATE', slice the date
              if (field.slice(-4) === "DATE") {
                formfield.setAttribute("type", "date");
                formfield.setAttribute(
                  "value",
                  record[key][field].slice(0, 10)
                );
              } else {
                formfield.setAttribute("value", record[key][field]);
              }
            }
            requestDialog.appendChild(formfield);
          }
        }

        const saveDetail = document.createElement("button");
        saveDetail.textContent = "Save";
        saveDetail.setAttribute("class", "btn");
        saveDetail.setAttribute("class", "dialogSaveBtn");
        saveDetail.setAttribute("id", "saveDetail");
        requestDialog.appendChild(saveDetail);

        const btnCancelDetail = document.createElement("button");
        btnCancelDetail.textContent = "Cancel";
        btnCancelDetail.setAttribute("class", "btn");
        btnCancelDetail.setAttribute("class", "closedialog");
        btnCancelDetail.setAttribute("id", "btnCancelDetail");
        requestDialog.appendChild(btnCancelDetail);
      }

      // show the detail dialog
    //   requestDialog.showModal();

      // Listen for the saveDetail button click
      const saveDetail = document.querySelector("#saveDetail");
      const detailsUrl = "http://localhost:3000/sysdocs/" + drid;
      saveDetail.addEventListener("click", async (event) => {
        // prevent the default action
        event.preventDefault();
        // get the input id
        const nid = document.querySelector("#nid");
        let didValue = drid;

        let data = {
          DOCUMENT_ID: didValue,
        };

        for (const key in record) {
          for (const field in record[key]) {
            if (
              [
                "NAME",
                "TYPE",
                "SUBJECT",
                "STATUS",
                "REVISION_LEVEL",
                "ISSUE_DATE",
                "CTRL_DOC",
                "DIST_DOC",
              ].includes(field)
            ) {
              const fieldname = field;
              const fieldvalue = document.querySelector("#" + field).value;
              data = { ...data, [fieldname]: fieldvalue };
            }
          }
        }
        // add the user to the data object
        data = { ...data, MODIFIED_BY: user };
        // add the modified date to the data object
        const modifiedDate = new Date();
        data = { ...data, MODIFIED_DATE: new Date().toLocaleString() };

        if (test) {
          console.log(data);
        }

        const options = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };

        const response = await fetch(detailsUrl, options);
        // const json = await response.json();
        // searchbutton.click();
        requestDialog.close();
        // refresh the page
        window.location.reload();
      });

      // =============================================
      // Listen for the close button click
      const closebutton = document.querySelector("#btnCancelDetail");
      closebutton.addEventListener("click", async (event) => {
        // prevent the default action
        event.preventDefault();
        // close the requestDialog
        const requestDialog = document.querySelector("#requestDialog");
        requestDialog.close();
      });
    });

    //   Add event listener for the response button
    const editResponse = document.querySelector("#btnEditResp");
    editResponse.addEventListener("click", async (event) => {
      event.preventDefault();
      const responseDialog = document.querySelector("#responseDialog");
      // show the dialog
      responseDialog.showModal();
    });

    //   Add event listener for the request button
    const editRequest = document.querySelector("#btnEditText");
    editRequest.addEventListener("click", async (event) => {
      event.preventDefault();
      const requestDialog = document.querySelector("#requestDialog");
      // show the dialog
      requestDialog.showModal();
    });

    // =============================================
    // Listen for the btnEditReq button click
    const btnEditReq = document.querySelector("#btnEditReq");
    btnEditReq.addEventListener("click", async (event) => {
      // prvent the default action
      event.preventDefault();
      // show the detail dialog
      const requestDialog = document.querySelector("#requestDialog");
      requestDialog.showModal();
    });

  });
