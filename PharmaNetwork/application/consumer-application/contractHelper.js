const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
let gateway;


async function getContractInstance() {
	
	// A gateway defines which peer is used to access Fabric network
	// It uses a common connection profile (CCP) to connect to a Fabric Peer
	// A CCP is defined manually in file connection-profile-iit.yaml
	gateway = new Gateway();
	
	// A wallet is where the credentials to be used for this transaction exist
	// Credentials for user USERS_ADMIN was initially added to this wallet.
	const wallet = new FileSystemWallet('./identity/consumer');
	
	// What is the username of this Client user accessing the network?
	const fabricUserName = 'CONSUMER_ADMIN';
	
	// Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile-consumer.yaml', 'utf8'));
	
	// Set connection options; identity and wallet
	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};
	await gateway.connect(connectionProfile, connectionOptions);
	
	const channel = await gateway.getNetwork('pharmachannel');
	
	return channel.getContract('parmanet', 'org.pharma-network.com-pharmanet');
}

function disconnect() {
	gateway.disconnect();
}

module.exports.getContractInstance = getContractInstance;
module.exports.disconnect = disconnect;