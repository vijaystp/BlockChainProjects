'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

async function main(drugName, serialNo) {

	try {
		const pharmanetContract = await helper.getContractInstance();
		const viewHistoryBuffer = await pharmanetContract.submitTransaction('viewHistory', drugName, serialNo);

		// process response
		console.log('.....Processing view history of drug Transaction Response \n\n');
		let history = JSON.parse(viewHistoryBuffer.toString());
		console.log(history);
		console.log('\n\n.....View history of drug Transaction Complete!');
		return history;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

main(name, aadharNo).then(() => {
	console.log('View History Request Submitted on the Network');
});

module.exports.execute = main;
