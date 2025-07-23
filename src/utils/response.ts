import { IApiResponse } from "@/interfaces/user.interface";

export class ResponseHelper {
  static success<T>(
    data: T,
    message = "Success",
    status = 200
  ): IApiResponse<T> {
    return { status, data, message };
  }

  static error(message: string, status = 400): IApiResponse {
    return { status, message };
  }

  static created<T>(
    data: T,
    message = "Created successfully"
  ): IApiResponse<T> {
    return { status: 201, data, message };
  }

  static unauthorized(message = "Unauthorized"): IApiResponse {
    return { status: 401, message };
  }

  static forbidden(message = "Forbidden"): IApiResponse {
    return { status: 403, message };
  }

  static notFound(message = "Not found"): IApiResponse {
    return { status: 404, message };
  }
}
