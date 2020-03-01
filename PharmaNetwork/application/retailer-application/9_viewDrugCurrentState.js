'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

async function main(drugName, serialNo) {

	try {
		const pharmanetContract = await helper.getContractInstance();
		console.log('.....Requesting to get drug state the Network');
		const drugStateBuffer = await pharmanetContract.submitTransaction('viewDrugCurrentState', drugName, serialNo);
		let drugState = JSON.parse(drugStateBuffer.toString());
		console.log(drugState);
		console.log('\n\n..... Drug state Transaction Complete!');
		return drugState;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}
module.exports.execute = main;
