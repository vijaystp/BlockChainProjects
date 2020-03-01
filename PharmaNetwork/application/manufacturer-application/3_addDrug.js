'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

async function main(drugName, serialNo, mfgDate, expDate, companyCRN) {

	try {
		const pharmanetContract = await helper.getContractInstance();
		const drugBuffer = await pharmanetContract.submitTransaction('addDrug', drugName, serialNo, mfgDate, expDate, companyCRN);

		// process response
		console.log('.....Processing Add drug  Transaction Response \n\n');
		let drugObj = JSON.parse(drugBuffer.toString());
		return drugObj;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {
		helper.disconnect();

	}
}
module.exports.execute = main;
