import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { decodeToken } from "../utils/auth.js";

const verifyAuthentication = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decoded = decodeToken(token, process.env.ACCESS_TOKEN_SECRET);    

    const user = await User.findById(decoded?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    if (!user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }
    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.refreshToken;
        console.log('userObj', userObj);

    req.user = userObj;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export { verifyAuthentication };
