import { Subcription } from "../models/subcription.modle.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const subcribeChannel = asyncHandler(async (req, res) => {

    const {channelId} = req.params;
    const userId = req.user._id;

    if(!channelId?.trim()){
        throw new ApiError(400, "channelId is missing")
    }

    if(channelId === userId.toString()){
        throw new ApiError(400, "You cannot subscribe to yourself")
    }
    const chaannel = await  User.findOne({username: channelId}).select({_id: 1});
    const subcription = await Subcription.create({
        subscriber: userId,
        channel:  chaannel._id
    });
    await subcription.save();
    res.status(201).json({ message: "Subscribed successfully" });
});

export {
    subcribeChannel
}