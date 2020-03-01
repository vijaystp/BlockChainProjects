const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;

// Import all function modules

const addToWallet = require('./1_addToWallet');
const registerCompany = require('./2_registerCompany');
const viewHistory = require('./8_viewHistory');
const createPO = require('./4_createPO');
const createShipment = require('./5_createShipment');
const viewDrugCurrentState = require('./9_viewDrugCurrentState');

// Define Express app settings
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('title', 'Pharma network App');

app.get('/', (req, res) => res.send('Hello Distributor'));

app.post('/addToWallet/distributor', (req, res) => {
    addToWallet.execute(req.body.certificatePath, req.body.privateKeyPath).then (() => {
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
    viewHistory.execute(req.body.drugName, req.body.serialNo).then ((object) => {
        const result = {
            status: 'success',
            message: 'viewHistory request submitted on the Network',
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

app.post('/viewDrugCurrentState', (req, res) => {
    viewDrugCurrentState.execute(req.body.drugName, req.body.serialNo).then ((object) => {
        const result = {
            status: 'success',
            message: 'viewDrugCurrentStater request submitted on the Network',
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

app.post('/registerCompany', (req, res) => {
    registerCompany.execute(req.body.companyCRN, req.body.companyName,req.body.Location,req.body.organisationRole).then ((object) => {
        const result = {
            status: 'success',
            message: 'registerCompany request submitted on the Network',
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
app.post('/createPO', (req, res) => {
    createPO.execute(req.body.buyerCRN, req.body.sellerCRN,req.body.drugName,req.body.quantity).then ((object) => {
        const result = {
            status: 'success',
            message: 'PO request submitted on the Network',
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
    createShipment.execute(req.body.buyerCRN, req.body.drugName,req.body.listOfAssets,req.body.transporterCRN).then ((object) => {
        const result = {
            status: 'success',
            message: 'CREATE SHIPMENT request submitted on the Network',
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
