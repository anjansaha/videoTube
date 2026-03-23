import { User } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { decodeToken } from "../utils/auth";

const verifyAuthentication = asyncHandler((req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decoded = decodeToken(token, process.env.ACCESS_TOKEN_SECRET);
    const user = User.findById(decoded?._id).select(
      "-password",
      "-refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export{
    verifyAuthentication
}
