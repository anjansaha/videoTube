import  jwt from "jsonwebtoken";
import { ApiError } from "./apiError";

const decodeToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    throw new ApiError(401, "Invalid token");
  }
};

export{
    decodeToken
}