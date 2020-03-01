'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

async function main(buyerCRN, sellerCRN, drugName, quantity) {

	try {
		const pharmanetContract = await helper.getContractInstance();
		const createPOBuffer = await pharmanetContract.submitTransaction('createPO', buyerCRN, sellerCRN, drugName, quantity);

		let po = JSON.parse(createPOBuffer.toString());
		return po;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {
		helper.disconnect();

	}
}

module.exports.execute = main;
