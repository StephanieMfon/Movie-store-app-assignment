import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function newToken(user) {
  const payload = { id: user._id, email: user.email };
  console.log(payload);
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24,
  });

  return token;
}
