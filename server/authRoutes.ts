import { Router } from "express";
import { authMe, authLogout, loginBuyer, loginStaff, signupBuyer } from "./authController";

export const authRoutes = Router();

authRoutes.get("/me", authMe);
authRoutes.post("/logout", authLogout);
authRoutes.post("/signup-buyer", signupBuyer);
authRoutes.post("/login-buyer", loginBuyer);
authRoutes.post("/login-staff", loginStaff);
