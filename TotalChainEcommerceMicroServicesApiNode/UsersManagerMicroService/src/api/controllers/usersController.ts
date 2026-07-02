import { Request, Response } from "express";
import { UserService } from "../../services/userService";
import { ResponseHelper } from "../../core/helpers/ResponseHelper";
import { HttpAuditLogService } from "../../services/httpClients/HttpAuditLogService";

const userService = new UserService();

export async function getAll(req: Request, res: Response) {
  try {
    const users = await userService.getAllAsync();
    return ResponseHelper.success(res, "Users retrieved", users);
  } catch (error: any) {
    return ResponseHelper.error(res, "Failed to retrieve users", error.message);
  }
}

export async function getByEmail(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const user = await userService.getByIdAsync(email);
    if (!user) return ResponseHelper.notFound(res, "User not found");
    return ResponseHelper.success(res, "User retrieved", user);
  } catch (error: any) {
    return ResponseHelper.error(res, "Failed to retrieve user", error.message);
  }
}

export async function create(req: Request, res: Response) {
  try {
    const { email, name, password } = req.body;
    if (!email || !name || !password) return ResponseHelper.badRequest(res, "Email, name and password are required");
    const user = await userService.createAsync(req.body);
    await HttpAuditLogService.sendLog("User", email, "Created", null, user, req.userEmail || "system");
    return ResponseHelper.created(res, "User created", user);
  } catch (error: any) {
    return ResponseHelper.error(res, "Failed to create user", error.message);
  }
}

export async function update(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const existing = await userService.getByIdAsync(email);
    if (!existing) return ResponseHelper.notFound(res, "User not found");
    const updated = await userService.updateAsync(email, req.body);
    await HttpAuditLogService.sendLog("User", email, "Updated", existing, updated, req.userEmail || "system");
    return ResponseHelper.success(res, "User updated", updated);
  } catch (error: any) {
    return ResponseHelper.error(res, "Failed to update user", error.message);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const { email } = req.params;
    const existing = await userService.getByIdAsync(email);
    if (!existing) return ResponseHelper.notFound(res, "User not found");
    await userService.deleteAsync(email);
    await HttpAuditLogService.sendLog("User", email, "Deleted", existing, null, req.userEmail || "system");
    return ResponseHelper.success(res, "User deleted");
  } catch (error: any) {
    return ResponseHelper.error(res, "Failed to delete user", error.message);
  }
}
