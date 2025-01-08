// import { getUserValue } from './utils.mjs';
require("dotenv").config();
// sequelize...

const express = require("express");
const router = express.Router();
const mysql = require("mysql");

// ==================================================
// Get all records
router.get("/", (req, res) => {
  try {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: 3306,
      database: "quality",
    });
    connection.connect(function (err) {
      if (err) {
        console.error("Error connecting: " + err.stack);
        return;
      }

      const currentYear = new Date().getFullYear();
      const lastYear = currentYear - 1;
      const query = `SELECT pi.INPUT_ID, PEOPLE_ID, SUBJECT, pit.INPUT_TEXT from PEOPLE_INPUT pi left join PPL_INPT_TEXT pit on pi.INPUT_ID = pit.INPUT_ID WHERE YEAR(INPUT_DATE) = ${lastYear} and INPUT_TYPE = 'OPPR' ORDER BY INPUT_ID DESC;`;
      connection.query(query, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for reports: " + err);
          res.sendStatus(500);
          return;
        }
        res.json(rows);
      });

      connection.end();
    });
  } catch (err) {
    console.log("Error connecting to Db");
    return;
  }
});

module.exports = router;
