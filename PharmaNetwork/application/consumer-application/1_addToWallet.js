'use strict';

/**
 *  User Name: REGISTRAR_ADMIN
 *  User Organization: REGISTRAR
 *  User Role: Admin
 *
 */

const fs = require('fs'); 
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const path = require('path');

const crypto_materials = path.resolve(__dirname, '../network/crypto-config');

const wallet = new FileSystemWallet('./identity/consumer');

async function main(certificatePath, privateKeyPath) {

	try {

		// Fetch the credentials from our previously generated Crypto Materials required to create this user's identity
		const certificate = fs.readFileSync(certificatePath).toString();
		// IMPORTANT: Change the private key name to the key generated on your computer
		const privatekey = fs.readFileSync(privateKeyPath).toString();

		// Load credentials into wallet
		const identityLabel = 'CONSUMER_ADMIN';
		const identity = X509WalletMixin.createIdentity('consumerMSP', certificate, privatekey);

		await wallet.import(identityLabel, identity);

	} catch (error) {
		console.log(error.stack);
		throw new Error(error);
	}
}

main('/home/upgrad/workspace/pharma-network/network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/signcerts/Admin@consumer.pharma-network.com-cert.pem', '/home/upgrad/workspace/pharma-network/network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/keystore/3e757d2a1e167631110eb34632e7bfe1bafc84a98b535af7fb23176fec14c367_sk').then(() => {
  console.log('User identity added to wallet.');
});

module.exports.execute = main;
