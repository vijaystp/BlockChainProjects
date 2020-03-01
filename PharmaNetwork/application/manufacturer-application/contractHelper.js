const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
let gateway;


async function getContractInstance() {
	
	gateway = new Gateway();
	const wallet = new FileSystemWallet('./identity/manufacturer');
	const fabricUserName = 'MANUFACTURER_ADMIN';
	
	let connectionProfile = yaml.safeLoad(fs.readFileSync('./connection-profile-manufacturer.yaml', 'utf8'));
	
	let connectionOptions = {
		wallet: wallet,
		identity: fabricUserName,
		discovery: { enabled: false, asLocalhost: true }
	};
	
	await gateway.connect(connectionProfile, connectionOptions);
	const channel = await gateway.getNetwork('pharmachannel');
	return channel.getContract('pharmanet', 'org.pharma-network.com-pharmanet');
}

function disconnect() {
	gateway.disconnect();
}

module.exports.getContractInstance = getContractInstance;
module.exports.disconnect = disconnect;