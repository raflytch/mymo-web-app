export interface IFileValidation {
  isValid: boolean;
  error?: string;
}

export class FileUtil {
  static validateImageFile(file: File): IFileValidation {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: "Invalid file type. Only JPEG, PNG, and WebP are allowed.",
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: "File size too large. Maximum 5MB allowed.",
      };
    }

    return { isValid: true };
  }

  static async processFormData(formData: FormData): Promise<{
    fields: Record<string, string>;
    files: Record<string, File>;
  }> {
    const fields: Record<string, string> = {};
    const files: Record<string, File> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        if (value.size > 0) {
          files[key] = value;
        }
      } else {
        fields[key] = value as string;
      }
    }

    return { fields, files };
  }
}
