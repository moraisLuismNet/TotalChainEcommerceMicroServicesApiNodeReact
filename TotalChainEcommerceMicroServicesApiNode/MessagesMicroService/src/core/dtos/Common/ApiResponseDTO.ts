export interface ApiResponseDTO<T> {
  success: boolean;
  data: T | null;
  message: string;
  errors: string[];
}
