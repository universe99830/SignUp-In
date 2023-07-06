import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    isInterpreter: { type: String, required: false },
    balance:{type:String,required:false},
    algo_address:{type:String,required:false},
    algo_sk:{type:String,required:false},
    membership : {type:String,required:false},
    role: {type:String,required:false},
    isBusinessOwner : {type:String,required:false},
    businessKey : {type:String,required:false},
});

export const User = mongoose.model("reactUser", userSchema);
