"use strict";

const {Contract} = require('fabric-contract-api');

class PharmaContract extends Contract {
	
	constructor() {
        super('org.pharma-network.com-pharmanet'); 
	}
	async instantiate(ctx) {
		console.log('Enter--> Pharma Smart Contract');
	}
	
	/**
	* 
	* @param {*} ctx 
	* @param {*} companyCRN 
	* @param {*} companyName 
	* @param {*} Location 
	* @param {*} organisationRole
	*/
	// Company Name , CRN , Location & Org Role will be registered with this function
	async registerCompany (ctx,companyCRN, companyName, Location, organisationRole){
		let companyCrnNameKey = companyCRN+'-'+companyName;
		let comapanyCrnKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.companyCRN', [companyCRN]);
		var hierarchyKey 
		if (organisationRole == 'Manufacturer' || organisationRole == 'manufacturer')
			hierarchyKey = 1;
		else if(organisationRole == 'Distributor' || organisationRole == 'distributor')
			hierarchyKey = 2
		else if(organisationRole == 'Retailer' || organisationRole == 'retailer')
			hierarchyKey = 3;
	  
	   let companyObj={
		 m_comapanyID: companyCrnNameKey,
		 m_companyName: companyName,
		 m_Location: Location,
		 m_organisationRole: organisationRole,
		 m_hierarchyKey:hierarchyKey,
		 createdAt: new Date()
  };

        // Convert the JSON object to a buffer and send it to blockchain for storage
        let dataBuffer = Buffer.from(JSON.stringify(companyObj));
        await ctx.stub.putState(comapanyCrnKey, dataBuffer);

        console.log(" Registered Company is--> ",companyObj);
        return companyObj;
}

      /**
      * 
      * @param {*} drugName 
      * @param {*} serialNo 
      * @param {*} mfgDate 
      * @param {*} expDate 
      * @param {*} companyCRN 
      */
	
	//DrugName with serial number, manufacturing date, expirty date and relavant company CRN are added
	async addDrug (ctx,drugName, serialNo, mfgDate, expDate, companyCRN){
		this.isInitiatorValid(ctx, ['manufacturer.pharma-network.com']);
		let productKey = drugName+'-'+serialNo;
		let productRequestKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.product.drugkey', [productKey]);
		let ownerKey =  ctx.stub.createCompositeKey('org.pharma.network.pharmanet.companyCRN', [companyCRN]);
		let manufacturerKey =  companyCRN
		
		 let drugObj={
		   m_productID: productRequestKey,
		   m_drugName: drugName,
		   m_serialNo: serialNo,
		   m_mfgDate: mfgDate,
		   m_expDate: expDate,
		   m_owner: ownerKey,
		   m_manufacturer: manufacturerKey,
		   m_shipmentList:[],
		   createdAt: new Date()
         };
	     let dataBuffer = Buffer.from(JSON.stringify(drugObj));
	     await ctx.stub.putState(productRequestKey, dataBuffer);
		 console.log("Drug added --> ",drugObj)
		 return drugObj;
    }
	
      /**
      * 
      * @param {*} buyerCRN 
      * @param {*} sellerCRN 
      * @param {*} drugName 
      * @param {*} quantity 
      */
	// Purchase order is placed with a buyer and seller for a drugcreated along with quantity
	async createPO (ctx,buyerCRN, sellerCRN, drugName, quantity) {
		this.isInitiatorValid(ctx, ['retailer.pharma-network.com','distributor.pharma-network.com']);
		var productOrderKey = buyerCRN +'-'+drugName;
		const POcompositeKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.productorder', [productOrderKey]); 
		
		const buyerCompositeKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.companyCRN',[buyerCRN]);
		const sellerCompositeKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.companyCRN',[sellerCRN]);
	   let requestBuyerComapnyBuffer= await ctx.stub
						  .getState(buyerCompositeKey)
						  .catch(err => console.log(err));
		let buyerObj = JSON.parse(requestBuyerComapnyBuffer.toString());
		let requestSellerComapnyBuffer= await ctx.stub
						  .getState(sellerCompositeKey)
						  .catch(err => console.log(err));
		let sellerObj = JSON.parse(requestSellerComapnyBuffer.toString());
		if(buyerObj.m_hierarchyKey-sellerObj.m_hierarchyKey!= 1) {
			throw new Error("Unable to place Order!");
		}
          
		let productOrderObj={
		   drugName:drugName,
		   quantity:quantity,
		   poId:POcompositeKey,
		   buyerKey:buyerCompositeKey,
		   sellerKey:sellerCompositeKey
		}
		
		let poBuffer = Buffer.from(JSON.stringify(productOrderObj));
			await ctx.stub.putState(POcompositeKey, poBuffer);
			
		console.log("order Info--> ",productOrderObj)
		return productOrderObj;    
	}

    /**
	 * 
	 * @param {*} ctx 
	 * @param {*} buyerCRN 
	 * @param {*} drugName 
	 * @param {*} listOfAssets 
	 * @param {*} transporterCRN 
	 */
	 //Shipment of a drug with a transport company
	async createShipment (ctx,buyerCRN, drugName, listOfAssets, transporterCRN ) {
	  this.isInitiatorValid(ctx, ['manufacturer.pharma-network.com','distributor.pharma-network.com']);
	  let productOrderKey = buyerCRN+"-"+drugName;
	  let getProductCompositeKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.productorder', [productOrderKey]); 
	  
	  let requestPoBuffer= await ctx.stub
						 .getState(getProductCompositeKey)
						 .catch(err => console.log(err));
		   
		   
	  let productOrder = JSON.parse(requestPoBuffer.toString());
	  let m_listOfAssets;
	  m_listOfAssets = listOfAssets.split(',');
	  console.log("listOfAssets.length = ",m_listOfAssets.length+"  productOrder.quantity :",productOrder.quantity);
	  
	  if(productOrder.quantity != m_listOfAssets.length){
		throw new Error("Quantity & Order mismatch"); 
	}
	  for(var i = 0 ; i < m_listOfAssets.length ;i++){
        let drugCompositeKey = await ctx.stub.createCompositeKey('org.pharma.network.pharmanet.product.drugkey',[m_listOfAssets[i]]);
		  let requestBuffer = ctx.stub
		                      .getState(drugCompositeKey).catch(err => console.log(err));
          if(requestBuffer.length === 0){
			throw new Error(" Error in getting assets details from ledger, Check error logs ");
		 } 
	  }
	  const sellerKey =productOrder.sellerKey;
		let requestSellerBuffer= await ctx.stub
						 .getState(sellerKey)
						 .catch(err => console.log(err));
	  
	  let sellerObject = JSON.parse(requestSellerBuffer.toString());
	  let sellerCRN = sellerObject.m_comapanyID.split('-');
	  console.log("seller info--> ",sellerCRN[1]+" seller CRN is  --> ",sellerCRN[0])
	  
	  let creatorCompositeKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.companyCRN', [sellerCRN[0]]); 
	  let transporterCompositeKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.transporterKey', [transporterCRN]);

	  let shipmentObj={
			buyerCRN:buyerCRN,
			drugName:drugName,
			transporterCRN:transporterCRN,
			creator:creatorCompositeKey,
			m_AssetsList : m_listOfAssets,
			m_transporterDetails: transporterCompositeKey,
			m_status: "in-transit"
		}
	   var shipmentKey = buyerCRN +'-'+drugName;
	   const shipmentCompositeKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.shipmentkey', [shipmentKey]); 
       console.log("shipment info--> ",shipmentObj);
	   let dataBuffer = Buffer.from(JSON.stringify(shipmentObj));
	   await ctx.stub.putState(shipmentCompositeKey, dataBuffer);

	   return shipmentObj;
	}
   
   /**
	* 
	* @param {*} buyerCRN 
	* @param {*} drugName 
	* @param {*} transporterCRN 
	*/
	async updateShipment(ctx,buyerCRN, drugName, transporterCRN) {
       this.isInitiatorValid(ctx, ['transporter.pharma-network.com']);

       var shipmentKey = buyerCRN +'-'+drugName;
       const shipmentCompositeKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.shipmentkey', [shipmentKey]); 
   
       let requestShipmentBuffer= await ctx.stub
						 .getState(shipmentCompositeKey)
						 .catch(err => console.log(err));
	  
	   let shipmentObject = JSON.parse(requestShipmentBuffer.toString());
	   console.log("shipment info--> ",shipmentObject);
       if(transporterCRN != shipmentObject.transporterCRN){
		throw new Error("transporter mismatch with shipment info");
	   }
	  
	   shipmentObject.m_status = "delivered";
       console.log("shipment's are ",shipmentObject.m_AssetsList.length)
	   
	   let modifiedShipmentObBuffer = Buffer.from(JSON.stringify(shipmentObject));
	   await ctx.stub.putState(shipmentCompositeKey, modifiedShipmentObBuffer);
	   console.log("shipment info --> ", shipmentObject)
        
	   let drugCompositeObject ;
	   for(var i = 0 ; i < shipmentObject.m_AssetsList.length ;i++){
		
		 console.log(" updateShipment info ",shipmentObject.m_AssetsList[i]);
	     const getProductRequestKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.product.drugkey',[shipmentObject.m_AssetsList[i]]);
	
	     let requestProductBuffer= await ctx.stub
						 .getState(getProductRequestKey)
						 .catch(err => console.log(" error in getting state  --> ",err));

		if(requestProductBuffer.length === 0){
				throw new Error(" Details of the repository --> see logs ");
		}

		drugCompositeObject = JSON.parse(requestProductBuffer.toString());
		drugCompositeObject.m_owner = buyerCRN;
		drugCompositeObject.m_shipmentList.push(shipmentCompositeKey);
		 
		 let drugObBuffer = Buffer.from(JSON.stringify(drugCompositeObject));
		 await ctx.stub.putState(getProductRequestKey, drugObBuffer);
	}
		return shipmentObject;
 }

    /**
	 * @param {*} drugName 
	 * @param {*} serialNo 
	 * @param {*} retailerCRN 
	 * @param {*} customerAadhar 
	 */
 // customer getting a drug 
	async retailDrug (ctx,drugName, serialNo, retailerCRN, customerAadhar){
		this.isInitiatorValid(ctx, ["retailer.pharma-network.com"]);
	    let drugKey = drugName+'-'+serialNo
	    const getProductRequestKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.product.drugkey', [drugKey]);
	    let requestProductBuffer= await ctx.stub
						 .getState(getProductRequestKey)
						 .catch(err => console.log(err));
		
		let drugCompositeObject = JSON.parse(requestProductBuffer.toString());
		if(retailerCRN != drugCompositeObject.m_owner){
			throw new Error("retailer mismatch --> "+retailerCRN);
		}
		drugCompositeObject.m_owner = customerAadhar;

		let drugObBuffer = Buffer.from(JSON.stringify(drugCompositeObject));
		 await ctx.stub.putState(getProductRequestKey, drugObBuffer);
		return drugCompositeObject;
    }
  
    /**
	 * 
	 * @param {*} drugName 
	 * @param {*} serialNo 
	 */
// get the historical details.
     async viewHistory (ctx,drugName, serialNo){
	     this.isInitiatorValid(ctx, ['retailer.pharma-network.com','transporter.pharma-network.com','distributor.pharma-network.com','manufacturer.pharma-network.com','consumer.pharma-network.com']);
	     let drugCompositeKey = drugName+'-'+serialNo;
	     const getProductRequestKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.product.drugkey', [drugCompositeKey]);
	     let iterator = await ctx.stub.getHistoryForKey(getProductRequestKey).catch(err => console.log(err));;
         let result = [];
         let res = await iterator.next();
         while (!res.done) {
           if (res.value) {
             const obj = JSON.parse(res.value.value.toString('utf8'));
             result.push(obj);
           }
           res = await iterator.next();
         }
       await iterator.close();
       return result;
    }
	/**
	 * 
	 * @param {*} ctx 
	 * @param {*} drugName 
	 * @param {*} serialNo 
	 */
// What is the currentn state of the drug
	async viewDrugCurrentState (ctx,drugName, serialNo){
	   this.isInitiatorValid(ctx, ['retailer.pharma-network.com','transporter.pharma-network.com','distributor.pharma-network.com','manufacturer.pharma-network.com','consumer.pharma-network.com']);
	   let drugKey = drugName+'-'+serialNo
	   const getProductRequestKey = ctx.stub.createCompositeKey('org.pharma.network.pharmanet.product.drugkey', [drugKey]);
	   let requestProductBuffer= await ctx.stub
						 .getState(getProductRequestKey)
						 .catch(err => console.log(err));

	   let drugObject = requestProductBuffer.toString();
	   return drugObject;
   }
   
   // Utilities
	isInitiatorValid(ctx, initiator) {
		let flag = 0;
		const initiatorID = ctx.clientIdentity.getX509Certificate();
		initiator.forEach(function(orgs){
			if(initiatorID.issuer.organizationName.trim() === orgs){
			  flag = 1; 
		    }
		});
		if(flag == 0 ){
           throw new Error("organization authorized ? ");
        }
        organizationName.trim())
	}
}
module.exports = PharmaContract;