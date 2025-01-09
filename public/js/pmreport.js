// import { loadHeaderFooter } from "./utils.mjs";
// loadHeaderFooter();
const url = "http://localhost:3010/reports/pm";

const months = [];
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Get the first day of the month for the last 13 months, don't include the current month
const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const PMFormNames = {
  PM02: "Air Compressor",
  PM03: "Amada Shear",
  PM04: "Pneumatic (Assy)",
  PM05: "AutoSert",
  PM06: "100-3s Brake",
  PM07: "RG-50 Press Brake",
  PM09: "Air Filtration",
  PM10: "Despatch Oven",
  PM11: "Grieve Oven",
  PM12: "HyPress",
  PM13: "I-Mark",
  PM17: "Powder Coat",
  PM18: "Sanding",
  PM23: "Timesaver",
  PM24: "Tumbler",
  PM25: "Wisconsin Oven",
  PM26: "ACER Mill",
};

function exesAndOhs(newResponse) {
  if (newResponse === null) {
    newResponse = "";
  } else {
    newResponse = newResponse;

    const regex = /scan/gi;
    if (newResponse.match(regex)) {
      newResponse = "X";
    } else if (newResponse.match(/not[e]{0,1} done/gi)) {
      newResponse = "O";
    } else if (newResponse.match(/got it/gi)) {
      newResponse = "X";
    } else if (newResponse.match(/on file/gi)) {
      newResponse = "X";
    } else if (newResponse.match(/implementing/gi)) {
      newResponse = "O";
    } else if (newResponse.match(/no record/gi)) {
      newResponse = "O";
    } else if (newResponse.match(/no use/gi)) {
      newResponse = "X";
    } else if (newResponse.match(/not being used/gi)) {
      newResponse = "X";
    } else if (newResponse.match(/Filed,/gi)) {
      newResponse = "X";
    } else if (newResponse.match(/Retrieved/gi)) {
      newResponse = "X";
    } else if (newResponse.match(/Inop/gi)) {
      newResponse = "I";
    } else {
      newResponse = newResponse;
    }
  }
  return newResponse;
}

function convertDateToSemiYear(date) {
  const month = date.getMonth();
  const year = date.getFullYear();
  if (month <= 6) {
    return `${year}H1`;
  } else {
    return `${year}H2`;
  }
}

for (let i = 12; i > 0; i--) {
  const date = new Date(currentYear, currentMonth - i, 1);
  let month = monthNames[date.getMonth()];
  if (month === "Jan") {
    month += ` '${date.getFullYear().toString().slice(-2)}`;
  }
  months.push(month);
}

// console.log(months);
// Create a table with the months as headers, with the first column as the subject
const main = document.getElementById("main");
// create a table element
const table = document.createElement("table");
// set the id of the table
table.id = "report-table";
// append the table to the main element
const h1 = document.createElement("h1");
h1.innerText = "Preventive Maintenance";
main.appendChild(h1);
const h2 = document.createElement("h2");
h2.innerText = "Monthly PM Report";
main.appendChild(h2);
const p = document.createElement("p");
p.innerText = "X = Done, O = Not Done";
main.appendChild(p);
main.appendChild(table);
const header = table.createTHead();
// header.innerText = "Monthly PM Report";
const headerRow = header.insertRow(0);
headerRow.insertCell(0).innerHTML = "Subject";
months.forEach((date) => {
  headerRow.insertCell(-1).innerHTML = date;
});

// Fetch the data from the server
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // console.log(data);
    // filter out any INPUT_DATE that is newer than the last day of last month
    const lastDayOfLastMonth = new Date(currentYear, currentMonth, 0);
    // console.log(lastDayOfLastMonth);
    data = data.filter(
      (report) => new Date(report.INPUT_DATE) <= lastDayOfLastMonth
    );
    // filter out those that are not Monthly PMs
    let monthlydata = data.filter((report) => report.FREQUENCY === "M");
    // console.log(monthlydata);
    let monthlySubjects = monthlydata.map((report) => report.SUBJECT);
    // console.log(monthlySubjects);
    let uMonthlySubjects = [...new Set(monthlySubjects)];

    let quarterlydata = data.filter((report) => report.FREQUENCY === "Q");
    // console.log(quarterlydata);
    let quarterlysubjects = quarterlydata.map((report) => report.SUBJECT);
    // console.log(quarterlysubjects);
    let uQuarterlySubjects = [...new Set(quarterlysubjects)];

    let halfyearlydata = data.filter((report) => report.FREQUENCY === "H");
    // console.log(halfyearlydata);
    let halfyearlysubjects = halfyearlydata.map((report) => report.SUBJECT);
    // console.log(halfyearlysubjects);
    let uHalfyearlySubjects = [...new Set(halfyearlysubjects)];

    let yearlydata = data.filter((report) => report.FREQUENCY === "A");
    // console.log(yearlydata);
    let yearlysubjects = yearlydata.map((report) => report.SUBJECT);
    // console.log(yearlysubjects);
    let uYearlySubjects = [...new Set(yearlysubjects)];

    // console.log(uniqueSubjects);
    // for each subject enter the subject as teh first column in the row and then populate the responses for the dates
    uMonthlySubjects.forEach((subject) => {
      const row = table.insertRow(-1);
      try {
        row.insertCell(0).innerHTML =
          subject +
          " " +
          PMFormNames[subject] +
          "<br>" +
          monthlydata.find((report) => report.SUBJECT === subject).ASSIGNED_TO;
      } catch (error) {
        console.log(error);
        console.log(subject);
        row.insertCell(0).innerHTML = subject + " " + PMFormNames[subject];
      }

      months.forEach((shortmonth) => {
        // console.log(shortmonth);

        const report = data.find(
          (report) =>
            report.SUBJECT === subject &&
            new Date(report.INPUT_DATE).getMonth() ===
              monthNames.indexOf(shortmonth.split(" ")[0])
        );
        // console.log(report);
        let newResponse = report ? report.RESPONSE_TEXT : "";

        newResponse = exesAndOhs(newResponse);

        row.insertCell(-1).innerHTML = report ? newResponse : "";
        // row.insertCell(-1).innerHTML = 'X';
      });
    });

    // Make a table for Quarterly PMs
    const quarterlyTable = document.createElement("table");
    quarterlyTable.id = "quarterly-table";
    // Quarterly Heading
    const quarterlyH2 = document.createElement("h2");
    quarterlyH2.innerText = "Quarterly PM Report";
    main.appendChild(quarterlyH2);
    main.appendChild(quarterlyTable);
    const quarterlyHeader = quarterlyTable.createTHead();
    const quarterlyHeaderRow = quarterlyHeader.insertRow(0);
    quarterlyHeaderRow.insertCell(0).innerHTML = "Subject";

    // Determine previous 4 quarters
    const today = new Date();
    // const currentMonth = today.getMonth();
    // const currentYear = today.getFullYear();
    const quarter = Math.floor(currentMonth / 3);
    const quarterNames = ["Q1", "Q2", "Q3", "Q4"];
    const currentQuarter = quarterNames[quarter];
    const currentQuarterIndex = quarter;
    const previousQuarters = [];
    for (let i = 1; i < 5; i++) {
      previousQuarters.push(quarterNames[(currentQuarterIndex - i + 4) % 4]);
    }
    const quarterlyDates = previousQuarters.map((quarter) => {
      return quarter + " " + currentYear;
    });
    quarterlyDates.forEach((date) => {
      quarterlyHeaderRow.insertCell(-1).innerHTML = date;
    });


    // Make a table for Half Yearly PMs=====================================================
    const halfyearlyTable = document.createElement("table");
    halfyearlyTable.id = "halfyearly-table";
    // Half Yearly Heading
    const halfyearlyH2 = document.createElement("h2");
    halfyearlyH2.innerText = "Half Yearly PM Report";
    main.appendChild(halfyearlyH2);
    main.appendChild(halfyearlyTable);
    const halfyearlyHeader = halfyearlyTable.createTHead();
    const halfyearlyHeaderRow = halfyearlyHeader.insertRow(0);
    halfyearlyHeaderRow.insertCell(0).innerHTML = "Subject";

    let myhalves = [];
    const lastDayOfJune = new Date(currentYear, 5, 30);
    const lastDayOfDecember = new Date(currentYear, 11, 31);
    let lastTranspiredDate = today;
    if (today < lastDayOfJune) {
      lastTranspiredDate = lastDayOfDecember;
    } else if (today < lastDayOfDecember) {
      lastTranspiredDate = lastDayOfJune;
    }
    myhalves.push(convertDateToSemiYear(lastTranspiredDate));
    // from lastTranspiredDate, go back 7 more 6-month iterations to get the last 8 semi-annual periods
    for (let i = 0; i < 7; i++) {
      myhalves.push(
        convertDateToSemiYear(
          new Date(
            lastTranspiredDate.setMonth(lastTranspiredDate.getMonth() - 6)
          )
        )
      );
    }
    // console.log(myhalves);
    myhalves = myhalves.reverse();

    myhalves.forEach((date) => {
      halfyearlyHeaderRow.insertCell(-1).innerHTML = date;
    });

    uHalfyearlySubjects.forEach((halfyearlysubject) => {
      const row = halfyearlyTable.insertRow(-1);
      try {
        row.insertCell(0).innerHTML =
          halfyearlysubject +
          " " +
          PMFormNames[halfyearlysubject] +
          "<br>" +
          halfyearlydata.find((report) => report.SUBJECT === halfyearlysubject)
            .ASSIGNED_TO;
      } catch (error) {
        console.log(error);
        console.log(halfyearlysubject);
        row.insertCell(0).innerHTML =
          halfyearlysubject + " " + PMFormNames[halfyearlysubject];
      }

      myhalves.forEach((halfyear) => {
        const report = data.find(
          (report) =>
            report.SUBJECT === halfyearlysubject &&
            convertDateToSemiYear(new Date(report.INPUT_DATE)) === halfyear
            
          );

        let newResponse = report ? report.RESPONSE_TEXT : "";
        newResponse = exesAndOhs(newResponse);
        row.insertCell(-1).innerHTML = report ? newResponse : "";
      });
    });

    // Make a table for Yearly PMs =====================================================
    const yearlyTable = document.createElement("table");
    yearlyTable.id = "yearly-table";
    // Yearly Heading
    const yearlyH2 = document.createElement("h2");
    yearlyH2.innerText = "Yearly PM Report";
    main.appendChild(yearlyH2);
    main.appendChild(yearlyTable);
    const yearlyHeader = yearlyTable.createTHead();
    const yearlyHeaderRow = yearlyHeader.insertRow(0);
    yearlyHeaderRow.insertCell(0).innerHTML = "Subject";

    // Determine previous 4 years
    const previousYears = [];
    for (let i = 1; i < 5; i++) {
      previousYears.push(currentYear - i);
    }
    let yearlyDates = previousYears.map((year) => {
      return year;
    });

    // Reverse the array
    yearlyDates = yearlyDates.reverse();
    // previousYears = previousYears.reverse();

    yearlyDates.forEach((date) => {
      yearlyHeaderRow.insertCell(-1).innerHTML = date;
    });

    uYearlySubjects.forEach((yearlysubject) => {
      const row = yearlyTable.insertRow(-1);
      try {
        row.insertCell(0).innerHTML =
          yearlysubject +
          " " +
          PMFormNames[yearlysubject] +
          "<br>" +
          yearlydata.find((report) => report.SUBJECT === yearlysubject)
            .ASSIGNED_TO;
      } catch (error) {
        console.log(error);
        console.log(yearlysubject);
        row.insertCell(0).innerHTML =
          yearlysubject + " " + PMFormNames[yearlysubject];
      }

      yearlyDates.forEach((year) => {
        const report = data.find(
          (report) =>
            report.SUBJECT === yearlysubject &&
            new Date(report.INPUT_DATE).getFullYear() === year
        );
        let newResponse = report ? report.RESPONSE_TEXT : "";
        newResponse = exesAndOhs(newResponse);
        row.insertCell(-1).innerHTML = report ? newResponse : "";
      });
    });
  });
