import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/validations/user.validation";
import { ResponseHelper } from "@/utils/response";
import { authMiddleware } from "@/middlewares/auth.middleware";
import { UploadService } from "@/services/upload.service";
import { FileUtil } from "@/utils/file.util";
import { IUpdateUser, IUserResponse } from "@/interfaces/user.interface";

export async function handleUpdateUser(request: NextRequest) {
  try {
    const authResult = authMiddleware(request);
    if ("status" in authResult) {
      return NextResponse.json(authResult, { status: authResult.status });
    }

    const contentType = request.headers.get("content-type");
    let updateData: IUpdateUser;

    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      const { fields, files } = await FileUtil.processFormData(formData);

      updateData = { name: fields.name };

      if (files.avatar) {
        const validation = FileUtil.validateImageFile(files.avatar);
        if (!validation.isValid) {
          return NextResponse.json(ResponseHelper.error(validation.error!), {
            status: 400,
          });
        }

        const uploadResult = await UploadService.uploadAvatar(
          files.avatar,
          authResult.user.userId
        );
        updateData.avatar = uploadResult.url;
      }
    } else {
      const body: IUpdateUser = await request.json();
      updateData = updateUserSchema.parse(body);
    }

    const updatedUser = await prisma.user.update({
      where: { id: authResult.user.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        updatedAt: true,
      },
    });

    const userResponse: IUserResponse = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.updatedAt,
    };

    return NextResponse.json(
      ResponseHelper.success(userResponse, "User updated successfully")
    );
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json(ResponseHelper.error("Failed to update user"), {
      status: 500,
    });
  }
}
