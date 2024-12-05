
// import { exec } from "child_process";
import { loadHeaderFooter } from "./utils.mjs";
// import { exec } from 'child_process';
// import * as fs from 'node:fs/promises';
loadHeaderFooter();

const url = "http://localhost:3010/ncm";

let recordDate = new Date();
recordDate.setDate(recordDate.getDate());
// let recordDateTime = recordDate
recordDate = recordDate.toISOString().slice(0, 10);
const defaultNcmDate = document.getElementById("NCM_DATE");
defaultNcmDate.value = recordDate;

let myDueDateDefault = new Date();
myDueDateDefault.setDate(myDueDateDefault.getDate() + 14);
myDueDateDefault = myDueDateDefault.toISOString().slice(0, 10);
const defaultDueDate = document.getElementById("DUE_DATE");
defaultDueDate.value = myDueDateDefault;

// Send a POST request
const form = document.querySelector("#ncmform");
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const nextId = await fetch(url + "/nextId", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      JSON.stringify(data);
      return data;
    });

  const dataJson = {
    NCM_ID: nextId,
    // Create a now date for the record
    CREATE_DATE: new Date().toISOString(),
    CREATE_BY: "TKENT",
    CLOSED: "N",
  };
  for (let field of data.keys()) {
    // console.log(field);
    switch (field) {
      case "PEOPLE_ID":
        dataJson[field] = data.get(field).toUpperCase();
        break;
      case "ASSIGNED_TO":
        dataJson[field] = data.get(field).toUpperCase();
        break;
      case "SUBJECT":
        dataJson[field] = data.get(field).toUpperCase();
        break;
      case "PROJECT_ID":
        dataJson[field] = data.get(field).toUpperCase();
        break;
      default:
        if (field[field.length - 4] === "_DATE") {
          let myDate = data.get(field);
          myDate = myDate.slice(0, 10);
          dataJson[field] = myDate;
          // break;
        } else {
          dataJson[field] = data.get(field);
        }
    }
  }

  console.log(dataJson);

  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataJson),
    });
    // console.log('Success:', JSON.stringify(dataJson));
  } catch (err) {
    console.log("Error:", err);
  }

  form.reset();

// try {
//     const response = await fetch('../../python/ncm.py', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(dataJson),
//     });

//     if (!response.ok) {
//         throw new Error('Network response was not ok');
//     }

//     const result = await response.json();
//     console.log('Python script result:', result);
// } catch (error) {
//     console.error('Error running Python script:', error);
// }

// //   I think this is how to do it but it gives a cross origin error
// try {
//     const myyear = dataJson.NCM_DATE.substring(0, 4);
//     const dir = `//fs1/Quality - Records/8700 - Control of Nonconforming Product/${myyear}/${dataJson.NCM_ID}`;
//     try {
//         await fs.mkdir(dir, { recursive: true });
//     } catch (err) {
//         console.log("Error creating directory:", err);
//     }
// } catch (err) {
//     console.log("Error:", err);
// }

// try {
//   const myyear = dataJson.NCM_DATE.substring(0, 4);
//   const ncm_directory = `//fs1/Quality - Records/8700 - Control of Nonconforming Product/${myyear}/${dataJson.NCM_ID}`;

//   exec(`python ../../python/ncm.py ${ncm_directory}`, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`exec error: ${error.message}`);
//       return;
//     }
//     if (stderr) {
//       console.error(`stderr: ${stderr}`);
//       return;
//     }
//     console.log(`stdout: ${stdout}`);
//   });
// } catch (err) {
//   console.log("Error:", err);
// }

});
