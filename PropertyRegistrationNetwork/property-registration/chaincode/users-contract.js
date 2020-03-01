'use strict';

const {Contract} = require('fabric-contract-api');

class UsersContract extends Contract {

	constructor() {
		// Provide a  name to refer to this smart contract
        super('org.property-registration-network.regnet-users');
    }
    

	async instantiate(ctx) {
		console.log('Regnet-Users Smart Contract Instantiated');
    }
    /**
	 * Create a request to registrar for registering on the network
	 * @param ctx - The transaction Context object
	 * @param name - Name of the user who is initiating the request
	 * @param email - Email Id of the user
	 * @param aadharNo - Aadhar Number of the user
	 * @param phone - Phone number of the user
	 */
	async requestNewUser(ctx, name, email, phone, aadharNo)
	{
		// Create a new composite key for the new request
		const requestKey = ctx.stub.createCompositeKey('org.property-registration-network.com.regnet.users.requests', [name,aadharNo]);
		//Create a request object to be stored in blockchain

		console.log(requestKey);
		let requestObj={
			requestID: requestKey,
			name: name,
			email: email,
			aadharNumber: aadharNo,
			phone: phone,
			createdAt: new Date()
		};

		// Convert the JSON object to a buffer and send it to blockchain for storage
		let dataBuffer = Buffer.from(JSON.stringify(requestObj));
		await ctx.stub.putState(requestKey, dataBuffer);
		// Return value of new student account created to user
		return requestObj;
	}
	 
	/**
    * rechargeAccount() is used to recharge the user's account with 
    * @param ctx - context object
    * @param bankTransactionID -  Proof that the transaction is done of the requisite amount
    * @param name - Name of the user 
    * @param aadharNumber - Aadhar Number of the user
    */

    async rechargeAccount(ctx, name, aadharNumber, TransactionID)
    {  
	   const userKey = ctx.stub.createCompositeKey('org.property-registration-network.com.regnet.users', [name,aadharNumber]);
	   let userBuffer= await ctx.stub.getState(userKey).catch(err => console.log(err));
	   let userObject= JSON.parse(userBuffer.toString());
	   let numUpgradCoins= this.validateTransaction(TransactionID);

	   if (numUpgradCoins != -1)
	   {
	     userObject.upgradCoins= userObject.upgradCoins+numUpgradCoins;
	     let userBuffer = Buffer.from(JSON.stringify(userObject));
	     await ctx.stub.putState(userKey, userBuffer);
	    } else{
	      throw new Error( 'Invalid Transaction ID, can not upgrade balance ' );
	   }
    }
 
    /**
	 * viewUser() function to view the current state of any user
	 * @param ctx 
	 * @param name 
	 * @param aadharNumber
	 */
	
	async viewUser(ctx, name, aadharNumber)
	{
		const userKey = ctx.stub.createCompositeKey('org.property-registration-network.com.regnet.users', [name,aadharNumber]);
		let userBuffer= await ctx.stub.getState(userKey).catch(err => console.log(err));
		let userObject= JSON.parse(userBuffer.toString());
		console.log(userObject);
	}

    /**
	 * propertyRegistrationRequest(), Method initiated by the user to register 
	 * the details of their property on the property-registration-network.
	 * @param {*} ctx 
	 * @param {*} name 
	 * @param {*} aadharNo 
	 * @param {*} propertyID 
	 * @param {*} price 
	 */
	async propertyRegistrationRequest(ctx, name, aadharNumber, propertyID, price)
	{
		const requestKey= ctx.stub.createCompositeKey('org.property-registration-network.com.regnet.property.requests', [propertyID]);
		const userKey = ctx.stub.createCompositeKey('org.property-registration-network.com.regnet.users', [name,aadharNumber]);
		let userBuffer= await ctx.stub.getState(userKey).catch(err => console.log(err));
		if (userBuffer.length === 0)
			throw new Error(' User is not registered' );
		else
		{
			let propertyRegRequestObj={
				requestID: requestKey,
				owner: userKey,
				price: parseInt(price),
				status: 'registered'
			};

			let dataBuffer = Buffer.from(JSON.stringify(propertyRegRequestObj));
			await ctx.stub.putState(requestKey, dataBuffer);
			return propertyRegRequestObj;
		}
	}

    /**
	 * viewProperty(),view the current state of any property registered on the ledger.
	 * @param {*} ctx 
	 * @param {*} propertyID 
	 */
	async viewProperty(ctx, propertyID)
	{
		const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.com.regnet.property', [propertyID]);
		let propertyBuffer= await ctx.stub.getState(propertyKey).catch(err => console.log(err));
		let propertyObject= JSON.parse(propertyBuffer.toString());
		return propertyObject;
	}

    /**
	 * updateProperty(),function is invoked to change the status of the property. 
	 * @param {*} ctx 
	 * @param {*} propertyID 
	 * @param {*} name 
	 * @param {*} aadharNumber 
	 * @param {*} status 
	 */
	async updateProperty(ctx, propertyID, name, aadharNumber, status)
	{
		const owner= ctx.stub.createCompositeKey('org.property-registration-network.com.regnet.users', [name,aadharNumber]);
		const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.com.regnet.property', [propertyID]);
		let propertyBuffer= await ctx.stub.getState(propertyKey).catch(err => console.log(err));
		let propertyObject= JSON.parse(propertyBuffer.toString());
		if (propertyObject.owner == owner)
		{
			propertyObject.status= status;
			let dataBuffer = Buffer.from(JSON.stringify(propertyObject));
			await ctx.stub.putState(propertyKey, dataBuffer);
		}
		else
			throw new Error('User: '+ name + ' with Aadhar Number: '+ aadharNumber + 'not authorised');
	}
    
    /**
	 * purchaseProperty(), properties listed for sale can be purchased by a user registered on the network.
	 * @param {*} ctx 
	 * @param {*} propertyID 
	 * @param {*} name 
	 * @param {*} aadharNumber 
	 */
	async purchaseProperty(ctx, propertyID, name, aadharNumber)
	{
		const buyerKey= ctx.stub.createCompositeKey('org.property-registration-network.com.regnet.users', [name,aadharNumber]);
		let buyerBuffer = await ctx.stub.getState(buyerKey).catch(err => console.log(err));
		let buyerObject = JSON.parse(buyerBuffer.toString());
		const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.com.regnet.property', [propertyID]);
		let propertyBuffer= await ctx.stub.getState(propertyKey).catch(err => console.log(err));
		let propertyObject= JSON.parse(propertyBuffer.toString());
		let sellerKey= propertyObject.owner;
		let sellerBuffer = await ctx.stub.getState(sellerKey).catch(err => console.log(err));
		let sellerObject= JSON.parse(sellerBuffer.toString());

		if (buyerBuffer.length === 0)
			throw new Error('User: '+ name + ' with Aadhar Number: '+ aadharNumber + 'not registered on the property registration network');
		if (propertyObject.status === 'registered')
			throw new Error('Property with PropertyID: '+ propertyID + 'not registered for sale. Please contact the owner of the property. :)');
		console.log("buyerObject.numUpgradCoins:  ",buyerObject.numUpgradCoins);
		console.log("propertyObject.price: ",propertyObject.price);
		
		if (buyerObject.upgradCoins >= propertyObject.price)
		{
			propertyObject.owner=buyerKey;
			propertyObject.status = 'registered';
			sellerObject.upgradCoins += propertyObject.price;
			buyerObject.upgradCoins -= propertyObject.price;
			let propertyBuffer = Buffer.from(JSON.stringify(propertyObject));
			await ctx.stub.putState(propertyKey, propertyBuffer);
			let sellerBuffer = Buffer.from(JSON.stringify(sellerObject));
			await ctx.stub.putState(sellerKey, sellerBuffer);
			let buyerBuffer = Buffer.from(JSON.stringify(buyerObject));
			await ctx.stub.putState(buyerKey, buyerBuffer);

		}
		else
			throw new Error('Buyer has insufficient funds');
	}

	validateTransaction(bankTransactionID)
	{
		//Perform operations to validate the transaction from the bank.
		if (bankTransactionID == 'upg100')
			return 100;
		else if (bankTransactionID == 'upg500')
			return 500;
		else if (bankTransactionID == 'upg1000')
			return 1000;
		else
			return -1;
	}

	
}
module.exports = UsersContract;
