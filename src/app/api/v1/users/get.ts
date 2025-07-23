import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ResponseHelper } from "@/utils/response";
import { generateToken, authMiddleware } from "@/middlewares/auth.middleware";
import { verifyGoogleToken } from "@/lib/google";
import { IAuthResponse, IUserResponse } from "@/interfaces/user.interface";

export async function handleGoogleLogin(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const googleToken = url.searchParams.get("token");

    if (!googleToken) {
      return NextResponse.json(
        ResponseHelper.error("Google token is required"),
        { status: 400 }
      );
    }

    const googleUser = await verifyGoogleToken(googleToken);

    let user = await prisma.user.findUnique({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          password: "",
          avatar: googleUser.avatar,
        },
      });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    const response: IAuthResponse = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    };

    return NextResponse.json(
      ResponseHelper.success(response, "Google login successful")
    );
  } catch (error) {
    console.error("Google login error:", error);
    return NextResponse.json(ResponseHelper.error("Google login failed"), {
      status: 500,
    });
  }
}

export async function handleGetUser(request: NextRequest) {
  try {
    const authResult = authMiddleware(request);
    if ("status" in authResult) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    const user = await prisma.user.findUnique({
      where: { id: authResult.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(ResponseHelper.notFound("User not found"), {
        status: 404,
      });
    }

    const userResponse: IUserResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      ResponseHelper.success(userResponse, "User profile retrieved")
    );
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(ResponseHelper.error("Failed to get user"), {
      status: 500,
    });
  }
}
