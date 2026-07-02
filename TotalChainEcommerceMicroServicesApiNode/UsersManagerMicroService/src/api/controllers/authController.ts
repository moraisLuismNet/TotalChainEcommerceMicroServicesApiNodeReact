import { Request, Response } from "express";
import { AuthService } from "../../services/authService";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";

const authService = new AuthService();

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return ResponseHelper.badRequest(res, "Email and password are required");
    const result = await authService.loginAsync({ email, password });
    return ResponseHelper.success(res, "Login successful", result);
  } catch (error: any) {
    return ResponseHelper.error(res, "Login failed", error.message);
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) return ResponseHelper.badRequest(res, "Email, name and password are required");
    const result = await authService.registerAsync(req.body);
    return ResponseHelper.created(res, "Registration successful", result);
  } catch (error: any) {
    return ResponseHelper.error(res, "Registration failed", error.message);
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { email, currentPassword, newPassword } = req.body;
    if (!email || !currentPassword || !newPassword) return ResponseHelper.badRequest(res, "Email, current password and new password are required");
    await authService.changePasswordAsync({ email, currentPassword, newPassword });
    return ResponseHelper.success(res, "Password changed successfully");
  } catch (error: any) {
    return ResponseHelper.error(res, "Change password failed", error.message);
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const userEmail = req.userEmail || req.user?.email;
    if (!userEmail) return ResponseHelper.unauthorized(res);
    const { UserService } = await import("../../services/userService");
    const userService = new UserService();
    const profile = await userService.getByIdAsync(userEmail);
    if (!profile) return ResponseHelper.notFound(res, "User not found");
    return ResponseHelper.success(res, "Profile retrieved", profile);
  } catch (error: any) {
    return ResponseHelper.error(res, "Failed to retrieve profile", error.message);
  }
}
