'use strict';


const helper = require('./contractHelper');
async function main(drugName, serialNo, retailerCRN, customerAadhar) {

	try {
		const pharmanetContract = await helper.getContractInstance();
		console.log('.....Requesting retail drug on the Network');
		const retailDrugBuffer = await pharmanetContract.submitTransaction('retailDrug', drugName, serialNo, retailerCRN, customerAadhar);

		// process response
		console.log('.....Processing retail drug Transaction Response \n\n');
		let drugOb = JSON.parse(retailDrugBuffer.toString());
		console.log('\n\n.....retail drug Transaction Complete!');
		return drugOb;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}
module.exports.execute = main;
