import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_SECRET || "fallback_access_secret";
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET || "fallback_refresh_secret";

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: "1d" });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};
