// ==================================================
// DOCUMENT CHANGE ROUTER

require('dotenv').config();
// sequelize...

const express = require('express');
const router = express.Router();
const mysql = require('mysql');


// ==================================================
// put response text
router.put('/response/:id', (req, res) => {
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
        // sql to insert on duplicate key update
        const query = `INSERT INTO DOCM_CHNG_RSPN (REQUEST_ID, RESPONSE_TEXT) VALUES ('${req.params.id}', '${req.body.RESPONSE_TEXT}') ON DUPLICATE KEY UPDATE RESPONSE_TEXT = '${req.body.RESPONSE_TEXT}'`;
        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for doc change response text: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        connection.end();
        });
    } catch (err) {
        console.log('Error connecting to Db 42');
        return;
    }
});


// ==================================================
// put request text
router.put('/request/:id', (req, res) => {
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
        // sql to insert on duplicate key update
        const query = `INSERT INTO DOC_CHG_REQ_TXT (REQUEST_ID, REQUEST_TEXT) VALUES ('${req.params.id}', '${req.body.REQUEST_TEXT}') ON DUPLICATE KEY UPDATE REQUEST_TEXT = '${req.body.REQUEST_TEXT}'`;
        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for doc change request text: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        connection.end();
        });
    } catch (err) {
        console.log('Error connecting to Db 93');
        return;
    }

});



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

        const query = 'select DOCUMENT_ID, REQUEST_ID, CHANGE_REASON, REQUEST_DATE, ASSIGNED_TO, CLOSED from DOCM_CHNG_RQST order by CLOSED, REQUEST_ID desc';
        // const query = 'select * from DOCM_CHNG_RQST';
        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for DOCM_CHNG_RQST: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        connection.end();
        });
    
    } catch (err) {
        console.log('Error connecting to Db 44');
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
        console.log('Connected to DB');

        const date_due = new Date(req.body.DUE_DATE);
        // convert ASSIGNED_TO to uppercase
        req.body.ASSIGNED_TO = req.body.ASSIGNED_TO.toUpperCase();
        // convert DOCUMENT_ID to uppercase
        req.body.DOCUMENT_ID = req.body.DOCUMENT_ID.toUpperCase();
        // convert to MySQL date format
        date_due.setDate(date_due.getDate() + 30);
        console.log(date_due.toLocaleDateString());
        date_due.toLocaleDateString();
        
        const query = `insert into DOCM_CHNG_RQST (REQUEST_ID
            , REQUEST_DATE
            , ASSIGNED_TO
            , DUE_DATE
            , DOCUMENT_ID
            , CHANGE_TYPE
            , CHANGE_REASON
            , PRIORITY
            , CREATE_BY
            , CREATE_DATE) values (
            '${req.body.REQUEST_ID}'
            ,'${req.body.REQUEST_DATE}'
            , '${req.body.ASSIGNED_TO}'
            , '${req.body.DUE_DATE}'
            , '${req.body.DOCUMENT_ID}'
            , '${req.body.CHANGE_TYPE}'
            , '${req.body.CHANGE_REASON}'
            , '${req.body.PRIORITY}'
            , '${req.body.CREATE_BY}'
            , '${req.body.CREATE_DATE}')`;
        
            // console.log(query);

        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for doc change insert: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        const updateQuery = `UPDATE SYSTEM_IDS SET CURRENT_ID = '${req.body.REQUEST_ID}' WHERE TABLE_NAME = 'DOCM_CHNG_RQST'`;
        connection.query(updateQuery, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for doc change system id update: ' + err);
                res.sendStatus(500);
                return;
            }
        });

        const updateQuery2 = `insert into DOC_CHG_REQ_TXT (REQUEST_ID, REQUEST_TEXT) values ('${req.body.REQUEST_ID}', '${req.body.REQUEST_TEXT}')`;
        connection.query(updateQuery2, (err, rows, fields) => {
            if (err) {
                console.log('Failed to update for doc change text: ' + err);
                res.sendStatus(500);
                return;
            }
        });

        connection.end();
        });

    } catch (err) {
        console.log('Error connecting to Db (changes 106)');
        return;
    }

});

// Get the next ID for a new dcr record
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

        const query = 'SELECT CURRENT_ID FROM SYSTEM_IDS where TABLE_NAME = "DOCM_CHNG_RQST"';
        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for corrective actions: ' + err);
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
        console.log('Error connecting to Db 157');
        return;
    }
});

// ==================================================
// Get a single record
router.get('/:id', (req, res) => {
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

        const query = `select dcr.*, dcrt.REQUEST_TEXT, dcrr.RESPONSE_TEXT 
        from DOCM_CHNG_RQST dcr 
        left join DOC_CHG_REQ_TXT dcrt on dcr.REQUEST_ID = dcrt.REQUEST_ID
        left join DOCM_CHNG_RSPN dcrr on dcr.REQUEST_ID = dcrr.REQUEST_ID
        where dcr.REQUEST_ID = '${req.params.id}'`;

        connection.query(query, (err, rows, fields) => {
            if (err) {
                console.log('Failed to query for doc change request: ' + err);
                res.sendStatus(500);
                return;
            }
            res.json(rows);
        });

        connection.end();
        });
    } catch (err) {
        console.log('Error connecting to Db 192');
        return;
    }
});



module.exports = router;