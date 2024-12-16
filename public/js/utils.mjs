async function loadTemplate(path) {
    const res = await fetch(path);
    const template = await res.text();
    return template;
  }

export function renderWithTemplate(template, parentElement, data, callback, position = "afterbegin"){
    if (parentElement) {
      parentElement.insertAdjacentHTML(position, template);
      if (callback) {
        callback(data);
      }
    } else {
      console.error("Parent element is null or undefined.");
    }
  }

export function renderWithTemplate2(template, parentElement, data, callback, position = "afterbegin"){
    if (parentElement) {
      let output = template;
      for (const key in data) {
        const regex = new RegExp(`{{${key}}}`, "g");
        output = output.replace(regex, data[key]);
      }
      parentElement.insertAdjacentHTML(position, output);
  }
  else {
    console.error("Parent element is null or undefined.");
  }
}

export async function loadReports(data){
    const main = document.querySelector('main');
    const reportsTemplate = await loadTemplate("/partials/report.html");
    for (const report of data) {
      renderWithTemplate2(reportsTemplate, main, report);
    }
  }


export async function loadHeaderFooter(){
    const headerTemplate = await loadTemplate("/partials/header.html");
    const headerElement = document.querySelector("#header");
    let footerTemplate = await loadTemplate('/partials/footer.html');
    const footerElement = document.querySelector("#footer");
    const year = new Date().getFullYear();
    footerTemplate = footerTemplate.replace("{{year}}", year);    
  
    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);
  }


  // get user value from config.json file
export async function getUserValue() {
    const res = await fetch("../js/config.json");
    const data = await res.json();
    return data.user;
  }

  // return datetime in format YYYY-MM-DD HH:MM:SS
export function getDateTime() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const dayOfMonth = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    return `${year}-${month}-${dayOfMonth} ${hours}:${minutes}:${seconds}`;
  }

// return form fields for data entry
export function getFormFields(myform) {
    let data = [];
    switch (myform) {
      case "csr":
        data = ["CUSTOMER_ID", "UNIT", "VALUE"];
        for (entryfield in data) {
          console.log(entryfield);
        }
      case "output":
        return ["output_id", "output_name", "output_description", "output_date", "output_time"];
      case "defect":
        return ["defect_id", "defect_name", "defect_description", "defect_date", "defect_time"];
      case "user":
        return ["user_id", "user_name", "user_email", "user_password"];
      default:
        return [];
    }
    return data;
  }

  // Determine document type
export function getDocType(docid) {
  let proposedDocType = 'P';
  if (/F[0-9]{4}-[0-9]{1,2}/.test(docid)) {
    proposedDocType = 'F';
  }
  return proposedDocType;
}

// return the parameter date in a yyyy-mm-dd format
export function displayDate(date) {
  if (!date) {
    return "";
  }
  
  const dateObj = new Date(date);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth() + 1;
  const day = dateObj.getDate();
  // if the month or day is less than 10, add a leading zero
  return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  
}