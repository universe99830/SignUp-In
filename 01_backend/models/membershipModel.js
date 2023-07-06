import mongoose from "mongoose";

const membershipSchema = mongoose.Schema({
    NFTID: { type: String, required: true },
    usdc: { type: String, required: false },
    platform_nft: { type: String, required: false },
    listed: { type: Boolean, required: false }
});

export const Membership = mongoose.model("reactMembership", membershipSchema);
