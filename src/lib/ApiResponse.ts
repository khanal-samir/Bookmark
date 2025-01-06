import { Document } from "mongoose";
export class ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: Document | Document[] | null;

  constructor(
    statusCode: number,
    data?: Document | Document[] | null,
    message: string = "Success",
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
  send() {
    return Response.json(
      {
        success: this.success,
        message: this.message,
        data: this.data,
      },
      { status: this.statusCode },
    );
  }
  // doesnt need to use new
  static success(
    data?: Document | Document[] | null,
    message: string = "Success",
  ) {
    return new ApiResponse(200, data, message).send();
  }

  static error(message: string = "Error occurred", statusCode: number = 500) {
    return new ApiResponse(statusCode, null, message).send();
  }

  static notFound(message: string = "Resource not found") {
    return new ApiResponse(404, null, message).send();
  }

  static unauthorized(message: string = "Not authenticated") {
    return new ApiResponse(401, null, message).send();
  }

  static badRequest(message: string = "Invalid request") {
    return new ApiResponse(400, null, message).send();
  }
}
