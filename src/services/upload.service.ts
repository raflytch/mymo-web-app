import { prisma } from "@/lib/prisma";
import { uploadToImageKit } from "@/lib/imagekit";

export interface IUploadResult {
  url: string;
  fileName: string;
}

export class UploadService {
  static async uploadAvatar(
    file: File,
    userId: string
  ): Promise<IUploadResult> {
    try {
      const fileName = `avatar_${userId}_${Date.now()}`;
      const url = await uploadToImageKit(file, fileName);

      return { url, fileName };
    } catch (error) {
      throw new Error("Failed to upload avatar");
    }
  }

  static async uploadHabitPhoto(
    file: File,
    userId: string,
    habitId: string
  ): Promise<IUploadResult> {
    try {
      const fileName = `habit_${habitId}_${userId}_${Date.now()}`;
      const url = await uploadToImageKit(file, fileName);

      return { url, fileName };
    } catch (error) {
      throw new Error("Failed to upload habit photo");
    }
  }

  static async uploadEntryPhoto(
    file: File,
    userId: string,
    entryId: string
  ): Promise<IUploadResult> {
    try {
      const fileName = `entry_${entryId}_${userId}_${Date.now()}`;
      const url = await uploadToImageKit(file, fileName);

      return { url, fileName };
    } catch (error) {
      throw new Error("Failed to upload entry photo");
    }
  }

  static async deleteUserData(userId: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        await tx.aiCoachLog.deleteMany({ where: { userId } });
        await tx.reflection.deleteMany({ where: { userId } });
        await tx.entry.deleteMany({ where: { userId } });
        await tx.habit.deleteMany({ where: { userId } });
        await tx.otpCode.deleteMany({ where: { userId } });
        await tx.user.delete({ where: { id: userId } });
      });
    } catch (error) {
      throw new Error("Failed to delete user data");
    }
  }
}
