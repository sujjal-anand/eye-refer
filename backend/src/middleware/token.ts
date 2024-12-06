import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Local } from "../env/config";

// Middleware to authenticate JWT
export const JWT = async (req: any, res: any, next: any) => {
  try {
    // Get the token from the "Authorization" header
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(403)
        .json({ message: "Access denied, no token provided" });
    }

    const token = authHeader.split(" ")[1];

    // If token is not provided, respond with 403 Forbidden
    if (!token) {
      return res
        .status(403)
        .json({ message: "Access denied, no token provided" });
    }

    // Verify the token and extract the payload
    let payload: JwtPayload;
    try {
      payload = jwt.verify(token, Local.Secret_Key) as JwtPayload;
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired" });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Invalid token" });
      }
      return res
        .status(500)
        .json({ message: "Authentication failed", error: error.message });
    }

    // Add payload data to the request object for later use
    (req as any).user = payload;

    // Proceed to the next middleware or route handler
    next();
  } catch (error: any) {
    // Log unexpected errors for better debugging
    console.error("JWT Authentication Error:", error);
    return res
      .status(500)
      .json({ message: "Authentication failed", error: error.message });
  }
};
