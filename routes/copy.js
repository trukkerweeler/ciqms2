require('dotenv').config();
// sequelize...

const express = require('express');
const router = express.Router();
const mysql = require('mysql');


// Copy a record
router.post('/', (req, res) => {
    try {
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            port: 3306,
            database: 'quality'
        });
        connection.connect(function(err) {
            if (err) {
                console.error('Error connecting: ' + err.stack);
                return;
            }
        // console.log('Connected to DB');
             
        const query = `insert into PEOPLE_INPUT (INPUT_ID
            , INPUT_DATE
            , PEOPLE_ID
            , ASSIGNED_TO
            , DUE_DATE
            , INPUT_TYPE
            , SUBJECT
            , PROJECT_ID
            , CLOSED
            , CREATE_DATE
            , CREATE_BY
            ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const queryParams = [
            req.body.INPUT_ID,
            req.body.INPUT_DATE,
            req.body.PEOPLE_ID,
            req.body.ASSIGNED_TO,
            req.body.DUE_DATE,
            req.body.INPUT_TYPE,
            req.body.SUBJECT,
            req.body.PROJECT_ID,
            req.body.CLOSED,
            req.body.CREATE_DATE,
            req.body.CREATE_BY
        ];
        
        // console.log(query);

        connection.query(query, queryParams, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for PEOPLE_INPUT insert: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        
        
        const insertQuery = `insert into PPL_INPT_TEXT values (?, ?)`;
        const insertQueryParams = [req.body.INPUT_ID, req.body.INPUT_TEXT];
        connection.query(insertQuery, insertQueryParams, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for PPL_INPT_TEXT insert: ' + err);
                res.sendStatus(500);
                return;
            }
        });

        const updateQuery = `UPDATE SYSTEM_IDS SET CURRENT_ID = ? WHERE TABLE_NAME = ?`;
        const updateQueryParams = [req.body.INPUT_ID, 'PEOPLE_INPUT'];
        connection.query(updateQuery, updateQueryParams, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for system id update: ' + err);
                res.sendStatus(500);
                return;
            }
        });

        connection.end();
        });

    } catch (err) {
        console.log('Error connecting to Db (changes 91)');
        return;
    }

});

module.exports = router;