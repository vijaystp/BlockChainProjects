'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');
async function main(companyCRN, companyName, Location, organisationRole) {

	try {
		const pharmanetContract = await helper.getContractInstance();
		const registerCompanyBuffer = await pharmanetContract.submitTransaction('registerCompany', companyCRN, companyName, Location, organisationRole);

		let comapny = JSON.parse(registerCompanyBuffer.toString());
		console.log(comapny);
		console.log('\n\n.....Register companY Transaction Complete!');
		return comapny;

	} catch (error) {

		console.log(`\n\n ${error} \n\n`);
		throw new Error(error);

	} finally {

		// Disconnect from the fabric gateway
		helper.disconnect();

	}
}

module.exports.execute = main;
