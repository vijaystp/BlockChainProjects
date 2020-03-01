'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);

let name = args[0].toString();
let aadharNo = args[1].toString();*/

async function main(drugName, serialNo) {

	try {
		const pharmanetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to get drug state the Network');
		const drugStateBuffer = await pharmanetContract.submitTransaction('viewDrugCurrentState', drugName, serialNo);

		// process response
		console.log('.....Processing drug state Transaction Response \n\n');
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

/*main(name, aadharNo).then(() => {
	console.log('Approve New User Submitted on the Network');
});*/

module.exports.execute = main;
