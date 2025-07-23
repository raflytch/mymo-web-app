import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
} from "@/validations/user.validation";
import { ResponseHelper } from "@/utils/response";
import { generateToken } from "@/middlewares/auth.middleware";
import { generateOTP, sendOTP } from "@/lib/nodemailer";
import {
  IUserRegister,
  IVerifyOtp,
  IResendOtp,
  IUserLogin,
  IAuthResponse,
} from "@/interfaces/user.interface";

export async function handleRegister(request: NextRequest) {
  try {
    const body: IUserRegister = await request.json();
    const validatedData = registerSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        ResponseHelper.error("Email already registered"),
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
      },
    });

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: {
        userId: user.id,
        email: validatedData.email,
        code: otpCode,
        type: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });

    await sendOTP(validatedData.email, otpCode);

    return NextResponse.json(
      ResponseHelper.created(
        { email: validatedData.email },
        "Registration successful. Please verify your email with the OTP sent."
      )
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(ResponseHelper.error("Registration failed"), {
      status: 500,
    });
  }
}

export async function handleLogin(request: NextRequest) {
  try {
    const body: IUserLogin = await request.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(ResponseHelper.error("Invalid credentials"), {
        status: 401,
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json(ResponseHelper.error("Invalid credentials"), {
        status: 401,
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
      ResponseHelper.success(response, "Login successful")
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(ResponseHelper.error("Login failed"), {
      status: 500,
    });
  }
}

export async function handleVerifyOTP(request: NextRequest) {
  try {
    const body: IVerifyOtp = await request.json();
    const { email, code } = verifyOtpSchema.parse(body);

    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        email,
        code,
        type: "EMAIL_VERIFICATION",
        used: false,
        expiresAt: { gte: new Date() },
      },
      include: { user: true },
    });

    if (!otpRecord) {
      return NextResponse.json(ResponseHelper.error("Invalid or expired OTP"), {
        status: 400,
      });
    }

    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { used: true },
    });

    const token = generateToken({
      userId: otpRecord.user.id,
      email: otpRecord.user.email,
    });

    const response: IAuthResponse = {
      user: {
        id: otpRecord.user.id,
        name: otpRecord.user.name,
        email: otpRecord.user.email,
        avatar: otpRecord.user.avatar,
        createdAt: otpRecord.user.createdAt,
      },
      token,
    };

    return NextResponse.json(
      ResponseHelper.success(response, "Email verified successfully")
    );
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(ResponseHelper.error("OTP verification failed"), {
      status: 500,
    });
  }
}

export async function handleResendOTP(request: NextRequest) {
  try {
    const body: IResendOtp = await request.json();
    const { email } = resendOtpSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(ResponseHelper.error("User not found"), {
        status: 404,
      });
    }

    await prisma.otpCode.deleteMany({
      where: {
        email,
        type: "EMAIL_VERIFICATION",
        used: false,
      },
    });

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.otpCode.create({
      data: {
        userId: user.id,
        email,
        code: otpCode,
        type: "EMAIL_VERIFICATION",
        expiresAt,
      },
    });

    await sendOTP(email, otpCode);

    return NextResponse.json(
      ResponseHelper.success({ email }, "OTP sent successfully")
    );
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(ResponseHelper.error("Failed to resend OTP"), {
      status: 500,
    });
  }
}
