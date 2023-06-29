import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { UnAuthorizedError } from "../error/error.js";

function authMiddleware(req, res, next) {
  const tokenArray = req.headers?.authorization?.split(" ");
  const tokenValue = tokenArray?.[1];

  try {
    if (!tokenValue) {
      throw new UnAuthorizedError("You must provide an authorization token");
    }
    const jwt_secret = process.env.JWT_SECRET;
    const payload = jwt.verify(tokenValue, jwt_secret);
    req.user = payload;
    next();
  } catch (err) {
    throw new UnAuthorizedError("Access denied, invalid token");
  }
}

export default authMiddleware;
