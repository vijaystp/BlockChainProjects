'use strict';

/**
 * This is a Node.JS application to Approve a New User on the Network
 */

const helper = require('./contractHelper');

/*var args = process.argv.slice(2);

let name = args[0].toString();
let aadharNo = args[1].toString();*/

async function main(companyCRN, companyName, Location, organisationRole) {

	try {
		const pharmanetContract = await helper.getContractInstance();

		
		console.log('.....Requesting to register company on the Network');
		const registerCompanyBuffer = await pharmanetContract.submitTransaction('registerCompany', companyCRN, companyName, Location, organisationRole);

		// process response
		console.log('.....Processing register company Transaction Response \n\n');
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

/*main(name, aadharNo).then(() => {
	console.log('Approve New User Submitted on the Network');
});*/

module.exports.execute = main;
