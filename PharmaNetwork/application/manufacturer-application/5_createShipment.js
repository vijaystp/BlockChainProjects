'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

async function main(buyerCRN, drugName, listOfAssets, transporterCRN) {

	try {
		const pharmanetContract = await helper.getContractInstance();
		const shipmentBuffer = await pharmanetContract.submitTransaction('createShipment', buyerCRN, drugName, listOfAssets, transporterCRN);

		// process response
		console.log('.....Processing Shipment creation request Transaction Response \n\n');
		let shipmentOb = JSON.parse(shipmentBuffer.toString());
		console.log(shipmentOb);
		console.log('\n\n.....Shipment creation request the Transaction Complete!');
		return shipmentOb;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}
module.exports.execute = main;
