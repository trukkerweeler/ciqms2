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
      const query = `SELECT COURSE_ATND_ID, COURSE_ID, DATE_TIME, PEOPLE_ID, INSTRUCTOR, MINUTES from CTA_ATTENDANCE WHERE YEAR(DATE_TIME) = ${currentYear} ORDER BY DATE_TIME DESC;`;
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
