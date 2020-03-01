const express = require('express');
const app = express();
const cors = require('cors');
const port = 4000;

// Import all function modules

const addToWallet = require('./1_addToWallet');
const registerCompany = require('./2_registerCompany');
const updateShipment = require('./6_updateShipment');
const viewHistory = require('./8_viewHistory');
const viewDrugCurrentState = require('./9_viewDrugCurrentState');

// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('title', 'Pharma network App');

app.get('/', (req, res) => res.send('Hello Transporter'));

app.post('/addToWallet/transporter', (req, res) => {
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
    viewHistory.execute(req.body.drugName, req.body.serialNo).then ((object) => {
        console.log('Approve New User request submitted on the Network');
        const result = {
            status: 'success',
            message: 'Approve New User request submitted on the Network',
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
        console.log('View User request submitted on the Network');
        const result = {
            status: 'success',
            message: 'View User request submitted on the Network',
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
    egisterCompany.execute(req.body.companyCRN, req.body.companyName,req.body.Location,req.body.organisationRole).then ((object) => {
        console.log('updateShipment request submitted on the Network');
        const result = {
            status: 'success',
            message: 'updateShipment request submitted on the Network',
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
//async updateShipment(ctx,buyerCRN, drugName, transporterCRN) {
app.post('/updateShipment', (req, res) => {
    updateShipment.execute(req.body.buyerCRN, req.body.drugName,req.body.transporterCRN).then ((object) => {
        console.log('updateShipment request submitted on the Network');
        const result = {
            status: 'success',
            message: 'updateShipment request submitted on the Network',
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
