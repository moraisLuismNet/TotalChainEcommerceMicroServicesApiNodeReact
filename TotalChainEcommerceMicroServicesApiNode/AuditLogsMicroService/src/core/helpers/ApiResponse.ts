export class ApiResponse<T> {
  public success: boolean;
  public data: T | null;
  public message: string;
  public errors: string[];

  private constructor(success: boolean, data: T | null, message: string, errors: string[]) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.errors = errors;
  }

  public static ok<U>(data: U, message: string = "Success"): ApiResponse<U> {
    return new ApiResponse<U>(true, data, message, []);
  }

  public static created<U>(data: U, message: string = "Created successfully"): ApiResponse<U> {
    return new ApiResponse<U>(true, data, message, []);
  }

  public static error(message: string = "Error", errors: string[] = []): ApiResponse<null> {
    return new ApiResponse<null>(false, null, message, errors);
  }

  public static notFound(message: string = "Not found"): ApiResponse<null> {
    return new ApiResponse<null>(false, null, message, []);
  }
}
