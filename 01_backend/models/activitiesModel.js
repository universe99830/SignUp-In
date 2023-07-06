import mongoose from "mongoose";

const activitiesSchema = mongoose.Schema({
    nft_id : { type: String, required: false },
    customer_id : { type: String, required: false },
    owner_id : { type: String, required: false },
    payment_method : {type:String, required: false},
    price : {type:String, required: false},
    transaction_id : {type:String, required: false},
    created_date : {type:String,required:false},
});

export const Activity = mongoose.model("activitytable", activitiesSchema);
