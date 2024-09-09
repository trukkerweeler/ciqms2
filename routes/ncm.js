// import { getUserValue } from './utils.mjs';
require('dotenv').config();
// sequelize...

const express = require('express');
const router = express.Router();
const mysql = require('mysql');


// ==================================================
// Get all records
router.get('/', (req, res) => {
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

        const query = `select n.NCM_ID
        , n.NCM_DATE
        , n.SUBJECT
        , n.ASSIGNED_TO
        , n.DUE_DATE
        , n.CLOSED
        , n.CLOSED_DATE
        , ne.DESCRIPTION
        , ni.DISPOSITION
        , nv.VERIFICATION
        from NONCONFORMANCE n 
        left join NCM_DESCRIPTION ne on n.NCM_ID = ne.NCM_ID
        left join NCM_DISPOSITION ni on n.NCM_ID = ni.NCM_ID
        left join NCM_VERIFICATION nv on n.NCM_ID = nv.NCM_ID
        order by n.NCM_ID desc`;

        // from NONCONFORMANCE n left join PPL_INPT_TEXT pit on pi.INPUT_ID = pit.INPUT_ID order by pi.INPUT_ID desc`;
        // where USER_DEFINED_1 = 'MR'
        
        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for inputs: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        connection.end();
        });
    
    } catch (err) {
        console.log('Error connecting to Db');
        return;
    }

});

// Get the next ID for a new record
router.get('/nextId', (req, res) => {
    // res.json('0000005');
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

        const query = 'SELECT CURRENT_ID FROM SYSTEM_IDS where TABLE_NAME = "NONCONFORMANCE"';
        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for nonconformance: ' + err);
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
        console.log('Error connecting to Db 100');
        return;
    }
});

// ==================================================
// Create a record
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
             
        const query = `insert into NONCONFORMANCE (NCM_ID
            , NCM_DATE
            , PEOPLE_ID
            , ASSIGNED_TO
            , DUE_DATE
            , NCM_TYPE
            , SUBJECT
            , PRODUCT_ID
            , CLOSED
            , CREATE_DATE
            , CREATE_BY
            ) values (
                '${req.body.NCM_ID}'
                , '${req.body.NCM_DATE}'
                , '${req.body.PEOPLE_ID}'
                , '${req.body.ASSIGNED_TO}'
                , '${req.body.DUE_DATE}'
                , '${req.body.NCM_TYPE}'
                , '${req.body.SUBJECT}'
                , '${req.body.PRODUCT_ID}'
                , '${req.body.CLOSED}'
                , '${req.body.CREATE_DATE}'
                , '${req.body.CREATE_BY}'
            )`;
        
        // console.log(query);

        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for PEOPLE_INPUT insert: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        
        // escape the apostrophe
        const ncmDesc = req.body.DESCRIPTION.replace(/'/g, "\\'");
        console.log(".post 160: " + ncmDesc);
        // escape the backslash
        const nid = req.body.NCM_ID;
        // const ncmDesc = req.body.DESCRIPTION.replace(/\\/g, "\\\\"); 
        const insertQuery = `insert into NCM_DESCRIPTION values ('${nid}', '${ncmDesc}')`;
        connection.query(insertQuery, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for NONCONFORMANCE insert: ' + err);
                res.sendStatus(500);
                return;
            }
        });

        const updateQuery = `UPDATE SYSTEM_IDS SET CURRENT_ID = '${req.body.NCM_ID}' WHERE TABLE_NAME = 'NONCONFORMANCE'`;
        connection.query(updateQuery, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for system id update: ' + err);
                res.sendStatus(500);
                return;
            }
        });

        connection.end();
        });

    } catch (err) {
        console.log('Error connecting to Db 188');
        return;
    }

});

// ==================================================
// Get a single record
router.get('/:id', (req, res) => {
    // console.log(req.params.id);
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

        const query = `SELECT 
        pi.INPUT_ID
        , pi.PEOPLE_ID
        , pi.PROJECT_ID
        , INPUT_DATE
        , pi.DUE_DATE
        , pi.ASSIGNED_TO
        , INPUT_TYPE
        , pi.SUBJECT
        , pi.CLOSED
        , pi.CLOSED_DATE
        , pit.INPUT_TEXT
        , pir.RESPONSE_TEXT
        , pif.FOLLOWUP_TEXT 
        , p.NAME
        , pirc.RECUR_ID
        FROM quality.PEOPLE_INPUT pi left join PPL_INPT_TEXT pit on pi.INPUT_ID = pit.INPUT_ID
        left join PPL_INPT_FLUP pif on pi.INPUT_ID = pif.INPUT_ID
        left join PPL_INPT_RSPN pir on pi.INPUT_ID = pir.INPUT_ID 
        left join PROJECT p on pi.PROJECT_ID = p.PROJECT_ID
        left join PPL_INPT_RCUR pirc on pi.USER_DEFINED_2 = pirc.RECUR_ID
        where pi.INPUT_ID = '${req.params.id}'`;

        // console.log(query);

        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for corrective actions: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        connection.end();
        });
    } catch (err) {
        console.log('Error connecting to Db 83');
        return;
    }
});

router.put('/:id', (req, res) => {
    // console.log("Params: " + req.params.id);
    // console.log(req.body);
    let mytable = '';
    let appended = '';
    const myfield = Object.keys (req.body) [2]
    // console.log(myfield);
    switch (myfield) {
        case 'DESCRIPTION':
            // console.log('Response');
            mytable = 'NCM_DESCRIPTION';
            // appended = req.body.RESPONSE_TEXT.replace(/'/g, "\\'");
            appended = req.body.DESCRIPTION.replace(/'/g, "/''");
            break;
        case 'DISPOSITION':
            // console.log('Followup');
            mytable = 'NCM_DISPOSITION';
            appended = req.body.DISPOSITION.replace(/'/g, "/''");
            // appended = req.body.FOLLOWUP_TEXT
            break;
        case 'VERIFICATION':
            // console.log('Input');
            mytable = 'NCM_VERIFICATION';
            appended = req.body.VERIFICATION.replace(/'/g, "/''");
            break;
        default:
            console.log('No match');
    }
    // Replace the br with a newline
    appended = appended.replace(/<br>/g, "\n");
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
        // console.log(req.body);
        const query = `REPLACE INTO ${mytable} SET 
        INPUT_ID = '${req.params.id}',
        ${myfield} = '${appended}'`;
        // console.log(query);
        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for input : ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });
    
        connection.end();
        });
    } catch (err) {
        console.log('Error connecting to Db 83');
        return;
    }

});

// CLOSE THE NCM<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
router.put('/close/:id', (req, res) => {
    // console.log("Params: " + req.params.id);
    // console.log(req.body);
    let mytable = '';
    let appended = '';
    const myfield = Object.keys (req.body) [1]
    
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
        const query = `UPDATE NONCONFORMANCE SET CLOSED = 'Y', CLOSED_DATE = '${req.body.CLOSED_DATE}' WHERE NCM_ID = '${req.params.id}'`;
        // console.log(query);

        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for nonconformance 346 : ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });
    
        connection.end();
        });
    } catch (err) {
        console.log('Error connecting to Db 356');
        return;
    }

});

// ==================================================
// Get previous records
router.get('/previous/:id', (req, res) => {
    // console.log(req.params.id);
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

        const query = `with subjects as (select * from PEOPLE_INPUT where SUBJECT = (select SUBJECT from PEOPLE_INPUT where INPUT_ID = '${req.params.id}')) select * from PPL_INPT_RSPN pir join subjects on pir.INPUT_ID = subjects.INPUT_ID order by pir.INPUT_ID desc limit 5`;

        // console.log(query);

        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for corrective actions: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        connection.end();
        });
    } catch (err) {
        console.log('Error connecting to Db 393');
        return;
    }
});


module.exports = router;