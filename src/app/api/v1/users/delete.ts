import { NextRequest, NextResponse } from "next/server";
import { ResponseHelper } from "@/utils/response";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { UploadService } from "@/services/upload.service";

export async function handleDeleteUser(request: NextRequest) {
  try {
    const authResult = authMiddleware(request);
    if ("status" in authResult) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    await UploadService.deleteUserData(authResult.user.userId);

    return NextResponse.json(
      ResponseHelper.success(null, "User deleted successfully")
    );
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(ResponseHelper.error("Failed to delete user"), {
      status: 500,
    });
  }
}
