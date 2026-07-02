import fetchAPI from "../utils/fetch-api";
import { extractItem } from "../utils/api-mapper";
import type { ILogin, ILoginResponse } from "../interfaces/login.interface";
import type { IRegister } from "../interfaces/register.interface";
import type { IApiResponse } from "../interfaces/api-response.interface";

export const authService = {
  login: async (credentials: ILogin): Promise<IApiResponse<ILoginResponse>> => {
    const response = await fetchAPI.post<unknown>("auth/login", credentials);
    const resp = response as Record<string, unknown>;
    const mappedData = extractItem<ILoginResponse>(response);
    return {
      success: resp.success as boolean,
      message: resp.message as string,
      data: mappedData,
    } as IApiResponse<ILoginResponse>;
  },

  register: async (user: IRegister): Promise<unknown> => {
    const body = {
      email: user.email,
      name: user.name || "",
      password: user.password,
      address: user.address || "",
      phoneNumber: user.phoneNumber || "",
    };
    return fetchAPI.post<unknown>("auth/register", body);
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getToken: (): string | null => {
    return localStorage.getItem("token");
  },

  getUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  saveAuthData: (token: string, user: unknown) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  },
};
