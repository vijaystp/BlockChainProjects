const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;

// Import all function modules

const addToWallet = require('./1_addToWallet');
const registerCompany = require('./2_registerCompany');
const addDrug = require('./3_addDrug');
const createShipment = require('./5_createShipment');
const viewHistory = require('./8_viewHistory');
const viewDrugCurrentState = require('./9_viewDrugCurrentState');


app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('title', 'Pharma network App');

app.get('/', (req, res) => res.send('Hello Manufacturer'));

app.post('/addToWallet/manufacturer', (req, res) => {
    addToWallet.execute(req.body.certificatePath, req.body.privateKeyPath).then (() => {
        console.log('User Credentials added to wallet');
        const result = {
            status: 'success',
            message: 'User credentials added to wallet'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/viewHistory', (req, res) => {
    viewHistory.execute(req.body.drugName, req.body.serialNo).then (() => {
        console.log('View History request submitted on the Network');
        const result = {
            status: 'success',
            message: 'View History request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/viewDrugCurrentState', (req, res) => {
    viewDrugCurrentState.execute(req.body.drugName, req.body.serialNo).then (() => {
        console.log('View drug state request submitted on the Network');
        const result = {
            status: 'success',
            message: 'View drug state request submitted on the Network'
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/registerCompany', (req, res) => {
    registerCompany.execute(req.body.companyCRN, req.body.companyName,req.body.Location,req.body.organisationRole).then ((object) => {
        console.log('Register Company request submitted on the Network');
        const result = {
            status: 'success',
            message: 'Register Company request submitted on the Network',
            returnObject: object
        };
        res.json(result);
        console.log("Comapny Object is ",result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});
// / async addDrug (ctx,drugName, serialNo, mfgDate, expDate, companyCRN){
app.post('/addDrug', (req, res) => {
    addDrug.execute(req.body.drugName, req.body.serialNo,req.body.mfgDate, req.body.expDate,req.body.companyCRN).then ((object) => {
        console.log('ADD DRUG request submitted on the Network');
        const result = {
            status: 'success',
            message: 'ADD DRUG  request submitted on the Network',
            returnObject: object
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.post('/createShipment', (req, res) => {
    createShipment.execute(req.body.drugName, req.body.serialNo,req.body.mfgDate, req.body.expDate,req.body.companyCRN).then ((object) => {
        console.log('createShipmentrequest submitted on the Network');
        const result = {
            status: 'success',
            message: 'createShipment  request submitted on the Network',
            returnObject: object
        };
        res.json(result);
    })
    .catch((e) => {
        const result = {
            status: 'error',
            message: 'Failed',
            error: e
        };
        res.status(500).send(result);
    });
});

app.listen(port, () => console.log(`Pharma Net App listening on port ${port}!`));
