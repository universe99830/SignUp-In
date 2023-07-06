
import Router from "express";
import { Activity } from "../models/activitiesModel.js";
import { User } from "../models/userModel.js";
const router = Router();

export const addNewActivity = async (nid, cid, oid, paymethod, Price, tid, dcreated) =>{

		 
		const nft_id = nid;
		const customer_id = cid;
		const owner_id = oid;
		const payment_method = paymethod
		const price = Price
		const transaction_id = tid
		const created_date = dcreated

	try{
			const newRecord = new Activity({
				nft_id,
				customer_id,
				owner_id,
				payment_method,
				price,
				transaction_id,
				created_date
			  }) 
 			await newRecord.save()

	}catch(err){
		console.log("Creating Activity",err)
	}

} 

router.post('/get', async(req,res) => {

	try{
		const {address} = req.body;
		const user = await User.findOne({ algo_address: address })
		if(!user) return res.send({result : 'failed'})

		
		if(user.role == '0') {
			// Admin Role
		   const result = await	Activity.find({});		
		   return res.send({result : 'success', data : result})
		}
		else{

			const result = await Activity.find({customer_id : address});		
			return res.send({result : 'success', data : result})
		}

	}catch(err){
		console.log(err)
		return res.send({result : 'failed'})
	}
	
})
export default router;