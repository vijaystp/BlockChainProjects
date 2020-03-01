'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

async function main(buyerCRN, drugName, listOfAssets, transporterCRN) {

	try {
		const pharmanetContract = await helper.getContractInstance();
		const shipmentBuffer = await pharmanetContract.submitTransaction('createShipment', buyerCRN, drugName, listOfAssets, transporterCRN);
		let shipmentOb = JSON.parse(shipmentBuffer.toString());
		return shipmentOb;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {
		helper.disconnect();
	}
}

main("RET002","paracetamol", "paracetamol-001,paracetamol-002", "TRA002").then(() => {
	console.log('Approve New User Submitted on the Network');
});

module.exports.execute = main;
