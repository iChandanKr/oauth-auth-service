import AuthRepo from "../repositories/auth.repo.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import type User from "../models/user.model.js";
import type { CreateUserInput } from "../types/user.type.js";
import { AppError } from "../utils/AppError.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
  async login(email: string) {
    // Business logic
    const user = await AuthRepo.findUserByEmail(email);
    if (!user) {
      throw AppError.notFound("User not found");
    }
    const token = this.generateJWT(user);
    return { message: "Login successful", user, token };
  }

  async register(userData: CreateUserInput) {
    const existingUser = await AuthRepo.findUserByEmail(userData.email);
    if (existingUser) {
      throw AppError.conflict("User already exists");
    }
    const newUser = await AuthRepo.CreateUser(userData);
    const token = this.generateJWT(newUser);
    return { message: "User created", user: newUser, token };
  }

  async verifyGoogleToken(idToken: string) {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID || "",
    });

    // Ensure ticket is unwrapped correctly, depending on TS version
    const payload = (await ticket).getPayload();
    if (!payload) {
      throw AppError.unauthorized("Invalid Google Token");
    }

    const { sub: googleId, email, name } = payload;

    if (!googleId) {
      throw AppError.unauthorized("Invalid Google Token");
    }

    let user: User | null = await AuthRepo.findUserByProviderId("google", googleId);

    if (!user && email) {
      // Check if user exists by email but not linked to google
      user = await AuthRepo.findUserByEmail(email);
      if (user) {
        // Link google account to existing user
        user.providerId = googleId;
        user.provider = "google";
        await user.save();
      } else {
        // Create new user
        user = await AuthRepo.CreateUser({
          firstName: name || email,
          email,
          providerId: googleId,
          provider: "google",
          password: null,
        });
      }
    }

    if (!user) {
      throw AppError.unauthorized("Failed to process Google authentication");
    }

    const token = this.generateJWT(user);
    return { message: "Google authentication successful", user, token };
  }

  generateJWT(user: User) {
    const secret = process.env.JWT_SECRET || "fallback_secret";
    return jwt.sign(
      { id: user.id, email: user.email, firstName: user.firstName },
      secret,
      {
        expiresIn: "1d",
      },
    );
  }
}

export default new AuthService();
