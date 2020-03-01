'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

async function main(drugName, serialNo) {

	try {
		const pharmanetContract = await helper.getContractInstance();
		const viewHistoryBuffer = await pharmanetContract.submitTransaction('viewHistory', drugName, serialNo);
let history = JSON.parse(viewHistoryBuffer.toString());
		return history;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {
helper.disconnect();

	}
}

module.exports.execute = main;
