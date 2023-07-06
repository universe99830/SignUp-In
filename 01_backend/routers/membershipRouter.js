import Router from "express";
import { Membership } from "../models/membershipModel.js";
import { User } from "../models/userModel.js";
import { MembershipShop } from "../models/membershipShopModel.js"
import { algodClient, CreateArc19, RemoveAsset, cidToReserveURL, transferToken, transferAlgo, transferUSDC, getSecrectKey, transfer } from './Lib/algorand.js'
import Stripe from 'stripe';
import algosdk from 'algosdk';
import {addNewActivity} from './activityRouter.js'
const router = Router();
router.post('/remove', async (req, res) => {
	const { address, unit_name } = req.body
	const rec = await User.findOne({ algo_address: address })
	RemoveAsset(address, getSecrectKey(rec.algo_sk), unit_name)
	res.send({ result: 'success' })
})

router.post("/getPlatformNFTlist", async (req, res) => {
	const { address,category } = req.body

	try {
		if (address) {
			const user = await User.findOne({ algo_address: address })
			if (!user) return res.send({ result: "failed" })

			const manager = algosdk.mnemonicToSecretKey(process.env.REACT_APP_MANAGER_KEY)
			const AdminWallet = manager.addr
			Membership.find({ platform_nft: '1'}, null, function (err, nftList) {
				
				return res.send({ result: nftList, admin: AdminWallet })
			});
		}
	}
	catch (err) {
		console.log(err)
		return res.send({ result: "failed" })
	}
})

router.post("/get", async (req, res) => {
	const { address, type } = req.body
	try {
		if (address) {
			const user = await User.findOne({ algo_address: address })
			if (!user) return res.send({ result: [] })

			Membership.find({ platform_nft: '1' }, null, function (err, nftList) {
				return res.send({ result: nftList })
			});
		}

	}
	catch (err) {
		console.log(err)
		return res.send({ result: "failed" })
	}
})

router.post("/getNFTsbyPlatform", async (req, res) => {
	const { address } = req.body
	try {
		if (address) {
			const user = await User.findOne({ algo_address: address })
			if (!user) return res.send({ result: [] })

			Membership.find({ platform_nft: '1' }, null, function (err, nftlist) {
				return res.send({ result: nftlist })
			});
		}

	}
	catch (err) {
		console.log(err)
		return res.send({ result: "failed" })
	}
})

async function Mint(address, membership, currency) {

	const user = await User.findOne({ algo_address: address })
	const membership_d = await Membership.findById(membership)

	if (currency == "algo") {
		const price = membership_d.algo;
		const to = membership_d.creator
		await transferAlgo(address, to, price, getSecrectKey(user.algo_sk))
	}
	else {
		const price = membership_d.usdc;
		const to = membership_d.creator
		await transferUSDC(address, to, price, getSecrectKey(user.algo_sk))
	}

	console.log("creating nft")
	const { url, reserveAddress } = cidToReserveURL(membership_d.picture.slice(21))
	await CreateArc19(address, membership_d.creator, membership_d.type, membership_d.unit_name, membership_d.description, url, reserveAddress, getSecrectKey(user.algo_sk))



	const company_id = membership_d.creator;
	const membership_id = membership;
	const user_id = address
	const isExist = await MembershipShop.findOne({ user_id: address, company_id: company_id })
	if (!isExist) {
		const user = new MembershipShop({
			company_id,
			membership_id,
			user_id
		})
		await user.save()
	}
	else {
		isExist.membership_id = membership_id
		await isExist.save()
	}

}
router.post("/buy", async (req, res) => {
	const { address, NFT, currency } = req.body

	// const user = await User.findOne({algo_address:address})
	// const membership_d = await Membership.findById(membership)
	// await RemoveAsset(address,getSecrectKey(user.algo_sk),'mship',membership_d.creator)
	// return;



	try {
		await buy_card(address, NFT, currency)

	

		return res.send({ result: "success" })
	}
	catch (err) {
		console.log(err)
		return res.send({ result: "failed" })
	}
})
router.post("/buy_card", async (req, res) => {
	const { address, NFT, currency,type } = req.body
	var payment_method =  type
	try {
		const user = await User.findOne({ algo_address: address })
		const NFT_d = await Membership.findOne({ NFTID: NFT.id })
		const manager = algosdk.mnemonicToSecretKey(process.env.REACT_APP_MANAGER_KEY)	
		var USD_ALGO = 1
		if (currency == "algo") {

			const response_2 = await fetch("https://price-api.crypto.com/price/v1/exchange/algorand")
			const json_2 = await response_2.json()
			var USD_ALGO = json_2.fiat.usd
			const price = parseInt(NFT.usdc / USD_ALGO * 1000000)
			console.log(price, "price")
			await transfer(address, manager.addr, getSecrectKey(user.algo_sk), price)

		} 

		else if (currency == "usdc") {

			await transferUSDC(address, manager.addr, NFT.usdc, getSecrectKey(user.algo_sk))

		} 
		else if (currency == "stripe" || currency == "error") {
			if(currency == 'stripe')
				payment_method = "Stripe Payment"
		} 

		else
		 {

			console.log(currency, "CurrencyError")
			return res.send({ result: "failed" })
		}
		 const price = currency == 'algo' ? (Math.floor(NFT.usdc / USD_ALGO) +' ALGO') : (NFT.usdc + ' USDC');
		
//------------------------------Transer NFT---------------------------------------//


			//Opt-In for the user wallet
			let assetID = Number(NFT.id); // change to your own assetID
			let params = await algodClient.getTransactionParams().do();
			params.fee = 1000;
			params.flatFee = true;
			let sender = address;
			let recipient = sender;
			let revocationTarget = undefined;
			let closeRemainderTo = undefined;
			let note = undefined;
			let amount = 0;
			let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, recipient, closeRemainderTo, revocationTarget,
				amount, note, assetID, params);
			let rawSignedTxn = txn.signTxn(getSecrectKey(user.algo_sk))
			let tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
			console.log("Transaction : " + tx.txId);

			// console.log(response, "res")

			// Send Asset
			sender = manager.addr;
			recipient = address;
			amount = 1;

			txn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, recipient, closeRemainderTo, revocationTarget,
				amount, note, assetID, params);

			rawSignedTxn = txn.signTxn(manager.sk)
			tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
			console.log("Transaction : " + tx.txId);


			
			
			NFT_d.platform_nft = 0;
			await NFT_d.save();


			const date = new Date();

			let day = date.getDate();
			let month = date.getMonth() + 1;
			let year = date.getFullYear();
			
			// This arrangement can be altered based on how we want the date's format to appear.
			let currentDate = `${day}-${month}-${year}`;
			 
			await addNewActivity(NFT.id,address,manager.addr,payment_method,price,String(tx.txId),currentDate)	

			return res.send({ result: "success" })

//----------------------------------End Trankser---------------------------------//

	}
	catch (err) {
		console.log(err, "err")
		return res.send({ result: "failed" })
	}
})

router.post("/update_card", async (req, res) => {
	const { address, membership } = req.body
	try {

		const user = await User.findOne({ algo_address: address })
		const membership_d = await Membership.findById(membership)
		const unit_name = "mship"

		await RemoveAsset(address, getSecrectKey(user.algo_sk), unit_name, membership_d.creator)

		const { url, reserveAddress } = cidToReserveURL(membership_d.picture.slice(21))
		await CreateArc19(address, membership_d.creator, membership_d.type, membership_d.unit_name, membership_d.description, url, reserveAddress, getSecrectKey(user.algo_sk))

		const company_id = membership_d.creator;
		const membership_id = membership;
		const user_id = address
		const isExist = await MembershipShop.findOne({ user_id: address, company_id: company_id })
		if (!isExist) {
			const user = new MembershipShop({
				company_id,
				membership_id,
				user_id
			})
			await user.save()
		}
		else {
			isExist.membership_id = membership_id
			await isExist.save()
		}

		return res.send({ result: "success" })
	}
	catch (err) {
		return res.send({ result: "failed" })
	}
})

// router.post("/get_company", async (req, res) => {
// 	const { membership } = req.body
// 	try {
// 		const rec = await Membership.findById(membership)
// 		if (rec) {
// 			res.send({ result: 'success', data: rec.creator })
// 		}
// 		else {
// 			res.send({ result: 'failed' })
// 		}

// 	} catch (err) {
// 		console.log(err)
// 		res.send({ result: 'failed' })
// 	}
// })

// router.post("/setPrice", async (req, res) => {
// 	const {NFTid, price, currency} = req.body
// 	try{

// 		const membership_d = await Membership.findOne({_id:NFTid})

// 		if(membership_d){
// 			if(currency == "algo"){
// 				membership_d.algo = price;
// 			} else (currency == "usdc"){
// 				membership_d.usdc = price;
// 			} else (currency == "eth"){
// 				membership_d.eth = price;
// 			}

// 		}
// 		const {url,reserveAddress} = cidToReserveURL(membership_d.picture.slice(21))
// 		await CreateArc19(address,membership_d.creator,membership_d.type,membership_d.unit_name,membership_d.description,url,reserveAddress,getSecrectKey(user.algo_sk)) 

// 	  	const company_id = membership_d.creator;
// 	  	const membership_id = membership;
// 	  	const user_id  =  address 
// 		const isExist =  await MembershipShop.findOne({user_id : address,company_id : company_id})
// 	  	if(!isExist) {
// 		  	const user =  new MembershipShop({
//    	  		company_id,
//    	  		membership_id,
//    	  		user_id
// 	   	    })
// 	   	    await user.save()
// 	  	}
// 	  	else{
// 	  		isExist.membership_id = membership_id
// 	  		await isExist.save()
// 	  	}

// 		return res.send({ result: "success"})
// 	}
// 	catch(err){
// 		 return res.send({ result: "failed"})
// 	}
// })

const StripeFun = async (email, name, usdc, stripe_key) => {
	const stripe = new Stripe(stripe_key);

	const session = await stripe.checkout.sessions.create({
		line_items: [
			{
				price_data: {
					currency: 'usd',
					product_data: {
						name: name,
					},
					unit_amount: parseFloat(usdc) * 100,
				},
				quantity: 1,
			},
		],
		customer_email: email,
		mode: 'payment',
		success_url: process.env.FRONT_URL + '/stripe?confirm=true',
		cancel_url: process.env.FRONT_URL + '/stripe?confirm=false',

	});
	return session.url;

}
router.post("/stripe", async (req, res) => {

	const { address, NFT } = req.body
	try {

		const user = await User.findOne({ algo_address: address })
		const NFT_d = await Membership.findOne({ NFTID: NFT.id })
		if (!user || !NFT_d)
			return res.send({ result: 'failed' })

		const stripe_key = process.env.STRIPE_KEY;
		const session_url = await StripeFun(user.email, NFT.name, NFT.usdc, stripe_key)

		res.send({ result: 'success', url: session_url })

	} catch (err) {
		console.log(err)
		res.send({ result: 'failed' })
	}

})
router.post("/upgrade", async (req, res) => {

	const { address, membership, currency } = req.body
	const user = await User.findOne({ algo_address: address })
	const membership_d = await Membership.findById(membership)
	const unit_name = "mship"
	try {

		await RemoveAsset(address, getSecrectKey(user.algo_sk), unit_name, membership_d.creator)

		await Mint(address, membership, currency)
		return res.send({ result: "success" })

	}
	catch (err) {
		console.log(err)
		return res.send({ result: "failed" })
	}

})

router.post("/get_top_level", async (req, res) => {

	try {
		Membership.find({}, null, { sort: { level: -1 } }, function (err, mships) {
			if (mships.length == 0)
				return res.send({ result: "0" })
			else
				return res.send({ result: mships[0].level })
		});
	}
	catch (err) {
		console.log(err)
		return res.send({ result: "failed" })
	}

})
router.post("/get_price", async (req, res) => {
	const { address, name } = req.body;
	try {
		const result = await Membership.findOne({ creator: address, type: name });
		if (!result) return res.send({ result: 'failed' })
		return res.send(
			{
				result: 'success',
				data:
				{
					algo: result.algo,
					usdc: result.usdc
				}
			}
		)
	}
	catch (err) {
		console.log(err)
		return res.send({ result: "failed" })
	}

})

router.post("/createASA", async (req, res) => {
	const { address, asset } = req.body;

	const user = await User.findOne({ algo_address: address })
	if(asset.id){
		(async () => {
			let assetID = asset.id; // change to your own assetID
			let params = await algodClient.getTransactionParams().do();
			let sender = address;
			let recipient = sender;
			let revocationTarget = undefined;
			let closeRemainderTo = undefined;
			let note = undefined;
			let amount = 0;
			let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, recipient, closeRemainderTo, revocationTarget,
				amount, note, assetID, params);
			let rawSignedTxn = txn.signTxn(getSecrectKey(user.algo_sk))
			let tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
			console.log("Transaction : " + tx.txId);
			return res.send({ result: "success", data: "Transaction : " + tx.txId })
		})().catch(e => {
			console.log(e);
			return res.send({ result: "failed" })
		});
	} else {
		for(var i = 0; i < asset.length; i++){
			(async () => {
				let assetID = asset[i].id; // change to your own assetID
				let params = await algodClient.getTransactionParams().do();
				let sender = address;
				let recipient = sender;
				let revocationTarget = undefined;
				let closeRemainderTo = undefined;
				let note = undefined;
				let amount = 0;
				let txn = algosdk.makeAssetTransferTxnWithSuggestedParams(sender, recipient, closeRemainderTo, revocationTarget,
					amount, note, assetID, params);
				let rawSignedTxn = txn.signTxn(getSecrectKey(user.algo_sk))
				let tx = (await algodClient.sendRawTransaction(rawSignedTxn).do());
				console.log("Transaction : " + tx.txId);
			})().catch(e => {
				console.log(e);
				return res.send({ result: "failed" })
			});
		}
		return res.send({ result: "success"})
	}
})

router.post("/update_list", async (req, res) => {
	const { NFTid } = req.body;
	try {
		const result = await Membership.findOne({ NFTID: NFTid });
		if (!result) return res.send({ result: 'failed' })

		if (typeof result.listed === "undefined") {
			result.listed = false;
		} else {
			result.listed = !result.listed;
		}

		await result.save()
		return res.send(
			{
				result: 'success'
			}
		)
	}
	catch (err) {
		console.log(err)
		return res.send({ result: "failed" })
	}
})

router.post("/updateListwithPrice", async (req, res) => {
	const { item, price } = req.body;
	try {
		if (item.id) {
			const result = await Membership.findOne({ NFTID: item.id });
			if (result) {
				result.usdc = price;
				result.listed = true;
				await result.save()
				return res.send(
					{
						result: 'success'
					}
				)
			} else {
				const nft = new Membership({
					NFTID: item.id,
					usdc: price,
					platform_nft: 1,
					listed: true
				})
				await nft.save()
				return res.send({ result: 'success' })
			}
		} else {
			for(var i = 0; i < item.length; i++) {
				const result = await Membership.findOne({ NFTID: item[i].id });
				if (result) {
					result.usdc = price;
					result.listed = true;
					await result.save()
				} else {
					const nft_d = new Membership({
						NFTID: item[i].id,
						usdc: price,
						platform_nft: 1,
						listed: true
					})
					await nft_d.save()
				}
			}
			return res.send({ result: 'success' })
		}
	}
	catch (err) {
		console.log(err)
		return res.send({ result: "failed" })
	}

})

export default router;