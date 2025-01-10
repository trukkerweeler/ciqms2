// import { getUserValue } from './utils.mjs';
require("dotenv").config();
// sequelize...

const express = require("express");
const router = express.Router();
const mysql = require("mysql");
let test = true;

// ==================================================
// Get a single record
router.get("/:id", (req, res) => {
  // console.log(req.params.id);
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
      // console.log('Connected to DB');

      const query = `SELECT NCM_ID
        , CUSTOMER_ID
        , SUPPLIER_ID
        , PROCESS_ID
        , AREA_NUMBER
        , ACTIVITY_NO
        , ELEMENT_NO
        , DISPOSITION_TYPE
        , TOOL_ID
        FROM quality.NONCONFORMANCE n 
        where n.NCM_ID = '${req.params.id}'`;

      // console.log(query);

      connection.query(query, (err, rows, fields) => {
        if (err) {
          console.log("Failed to query for corrective actions: " + err);
          res.sendStatus(500);
          return;
        }
        res.json(rows);
      });

      connection.end();
    });
  } catch (err) {
    console.log("Error connecting to Db 83");
    return;
  }
});

// ==================================================
// put the trend data
router.put('/:id', (req, res) => {
    const id = req.params.id;
    const data = req.body;
    console.log("65: " + data);
    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: 3306,
        database: 'quality'
    });
    connection.connect(function (err) {
        if (err) {
            console.error('Error connecting: ' + err.stack);
            return;
        }
        console.log('Connected to DB');
        let query = `UPDATE quality.NONCONFORMANCE SET `;

        let queryParams = [];
        for (let key in data) {
            query += `${key} = ?, `;
            queryParams.push(data[key]);
        }
        query = query.slice(0, -2);
        query += ` WHERE NCM_ID = ?`;
        queryParams.push(id);

        console.log("85: " + query);
        connection.query(query, queryParams, (err, rows, fields) => {
            if (err) {
          console.log('Failed to query for trend data: ' + err);
          res.sendStatus(500);
          return;
            }
            res.json(rows);
        });
        connection.end();
    });
});

module.exports = router;
