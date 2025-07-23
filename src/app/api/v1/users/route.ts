import { NextRequest } from "next/server";
import {
  handleRegister,
  handleVerifyOTP,
  handleResendOTP,
  handleLogin,
} from "./post";
import { handleGoogleLogin, handleGetUser } from "./get";
import { handleUpdateUser } from "./patch";
import { handleDeleteUser } from "./delete";

export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action === "login") {
    return handleLogin(request);
  }

  if (action === "verify-otp") {
    return handleVerifyOTP(request);
  }

  if (action === "resend-otp") {
    return handleResendOTP(request);
  }

  return handleRegister(request);
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action === "google-login") {
    return handleGoogleLogin(request);
  }

  return handleGetUser(request);
}

export async function PATCH(request: NextRequest) {
  return handleUpdateUser(request);
}

export async function DELETE(request: NextRequest) {
  return handleDeleteUser(request);
}
