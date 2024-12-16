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
      const query = `SELECT REQUEST_ID, REQUEST_DATE, ASSIGNED_TO, DUE_DATE, DOCUMENT_ID, CHANGE_TYPE, CHANGE_REASON, PRIORITY, DECISION, DECISION_DATE, CLOSED, CLOSED_DATE FROM quality.DOCM_CHNG_RQST WHERE (YEAR(REQUEST_DATE) = ${currentYear} OR YEAR(CLOSED) = ${currentYear}) OR (YEAR(REQUEST_DATE) < ${currentYear} AND CLOSED = 'N') ORDER BY REQUEST_DATE DESC;`;

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
