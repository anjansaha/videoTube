import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";
import { decodeToken } from "../utils/auth.js";

const generateAccessAndRefereshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token"
    );
  }
};



const registerUser = async (req, res) => {
  console.log("aa", req.files);
  const { email, username, fullName, password } = req.body;

  if (!email || !username || !fullName || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  const avatar = await uploadOnCloudinary(req.files?.avatar?.[0]?.path);
  const coverImage = await uploadOnCloudinary(req.files?.coverImage?.[0]?.path);
  if (!avatar) {
    return res.status(400).json({
      message: "Avatar upload failed",
    });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    avatar: avatar?.url || "",
    coverImage: coverImage?.url || "",
    email,
    password: hashedPassword,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
};

const loginUser = async (req, res) => {
  //username or email and password
  //check if user exists
  //compare password
  //generate access token and refresh token
  //save refresh token in db
  //send access token in response
  console.log("user", req.body);

  const { emailOrUsername, password } = req.body;
  const user = await User.findOne({
    $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );
  const loginUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken, user: loginUser },
        "User logged in successfully"
      )
    );
};

const logoutUser = async (req, res) => {
  console.log('req', req);
  
  const accessToken =
    req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
  console.log(req.headers.authorization?.split(" ")[1]);

  if (!accessToken) {
    throw new ApiError(401, "Unauthorized");
  }
  const decoded = decodeToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
  await User.findByIdAndUpdate(
    decoded._id,
    { refreshToken: "" },
    { new: true }
  );
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
};

const refreshToken = asyncHandler(async (req, res) => {
  console.log("refresh token called", req.cookies, req.body);
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    throw new ApiError(401, "Unauthorized");
  }
  const decoded = decodeToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  console.log("decoded", decoded);

  const user = await User.findById(decoded?._id).select("-password");
  console.log("decoded refresh token", user);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const varifyToken = user?.refreshToken === refreshToken;
  if (!varifyToken) {
    throw new ApiError(401, "Unauthorized");
  }
  const accessToken = user.generateRefreshToken();
  const newRefreshToken = user.refreshToken;
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Token refreshed successfully"
      )
    );
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = req.user;
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordCorrect = user.isPasswordCorrect(oldPassword)
  if(!isPasswordCorrect){
    throw new ApiError(401,"Invalid credentials")
  }

  user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, "password updated"))

    
})

const getUserChannelProfile = asyncHandler(async(req, res) => {
    const {username} = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "channel does not exists")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, channel[0], "User channel fetched successfully")
    )
})

const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "User profile fetched successfully")
        );
});

const getAllChannels = asyncHandler(async (req, res) => {
  const user = req.user;
    const channels = await User.aggregate([
      {
        $match: {
          _id: { $ne: user._id }
        }
      },
      {
        $project:{
          fullName: 1,
          username: 1,
          avatar: 1,
          coverImage: 1
        }
      }
    ])

    if (!channels?.length) {
      throw new ApiError(404, "No channels found");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, channels, "Channels fetched successfully")
      );
});
export {
  registerUser,
  loginUser,
  generateAccessAndRefereshTokens,
  logoutUser,
  decodeToken,
  refreshToken,
  changePassword,
  getUserChannelProfile,
  getUserProfile,
  getAllChannels
};
