import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { ResponseHelper } from "@/utils/response";
import { IJWTPayload, IApiResponse } from "@/interfaces/user.interface";

export function authMiddleware(
  request: NextRequest
): { user: IJWTPayload } | IApiResponse {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return ResponseHelper.unauthorized("Authorization token required");
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as IJWTPayload;

    return { user: decoded };
  } catch (error) {
    return ResponseHelper.unauthorized("Invalid or expired token");
  }
}

export function generateToken(payload: IJWTPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
}
