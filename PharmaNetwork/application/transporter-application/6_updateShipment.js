'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);
updateShipment(ctx,buyerCRN, drugName, transporterCRN
let name = args[0].toString();
let aadharNo = args[1].toString();*/

async function main(buyerCRN, drugName, transporterCRN) {

	try {
		const pharmanetContract = await helper.getContractInstance();

		
		console.log('..... requsting to update shipment on the Network');
		const updateShipmnentBuffer = await pharmanetContract.submitTransaction('updateShipment',buyerCRN, drugName, transporterCRN);

		// process response
		console.log('.....Processing  update shipment  Transaction Response \n\n');
		let shipmentobj = JSON.parse(updateShipmnentBuffer.toString());
		console.log(shipmentobj);
		console.log('\n\n..... update shipment  Transaction Complete!');
		return shipmentobj;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

/*main(name, aadharNo).then(() => {
	console.log('Approve New User Submitted on the Network');
});*/

module.exports.execute = main;
