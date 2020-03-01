'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */
const helper = require('./contractHelper');
async function main(drugName, serialNo) {

	try {
		const pharmanetContract = await helper.getContractInstance();
const drugStateBuffer = await pharmanetContract.submitTransaction('viewDrugCurrentState', drugName, serialNo);

		let drugState = JSON.parse(drugStateBuffer.toString());
		return drugState;

	} catch (error) {
		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);
} finally {	helper.disconnect();

	}
}

module.exports.execute = main;
