require('dotenv').config();

const express = require('express');
const router = express.Router();
const mysql = require('mysql');


router.post('/:aid', (req, res) => {
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
             
        const query = `INSERT INTO NINETYONETWENTY (COLLECT_ID, INPUT_ID, CUSTOMER_ID, UNIT, VALUE, SAMPLE_DATE, PEOPLE_ID) VALUES (?, ?, ?, ?, ?, ?, ?)`;

        const queryParams = [
            req.params.aid,
            req.body.INPUT_ID,
            req.body.CUSTOMER_ID,
            req.body.UNIT,
            req.body.VALUE,
            req.body.SAMPLE_DATE,
            req.body.INPUT_USER
        ];

        connection.query(query, queryParams, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for NINETYONETWENTY insert: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        const updateQuery = `UPDATE SYSTEM_IDS SET CURRENT_ID = ? WHERE TABLE_NAME = 'NINETYONETWENTY'`;
        const updateParams = [req.params.aid];

        connection.query(updateQuery, updateParams, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for system id update: ' + err);
                res.sendStatus(500);
                return;
            }
        });


        connection.end();
        });

    } catch (err) {
        console.log('Error connecting to Db (changes 175)');
        return;
    }

});


// Get the next ID for a new record
router.get('/nextCSRId', (req, res) => {
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

        const query = 'SELECT CURRENT_ID FROM SYSTEM_IDS where TABLE_NAME = "NINETYONETWENTY"';
        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for SYSTEM_IDS NINETYONETWENTY: ' + err);
                res.sendStatus(500);
                return;
            }
            const nextId = parseInt(rows[0].CURRENT_ID) + 1;
            let dbNextId = nextId.toString().padStart(7, '0');

            res.json(dbNextId);
        });    

        connection.end();
        });
    } catch (err) {
        console.log('Error connecting to Db 111');
        return;
    }
});


module.exports = router;