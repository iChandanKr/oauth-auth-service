import AuthRepo from '../repositories/AuthRepo.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthService {
    async login(email: string) {
        // Business logic
        const user = await AuthRepo.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        const token = this.generateJWT(user);
        return { message: 'Login successful', user, token };
    }

    async register(userData: any) {
        const existingUser = await AuthRepo.findUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const newUser = await AuthRepo.CreateUser(userData);
        const token = this.generateJWT(newUser);
        return { message: 'User created', user: newUser, token };
    }

    async verifyGoogleToken(idToken: string) {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID || '',
        });
        
        // Ensure ticket is unwrapped correctly, depending on TS version
        const payload = (await ticket).getPayload();
        if (!payload) {
            throw new Error('Invalid Google Token');
        }

        const { sub: googleId, email, name } = payload;
        
        let user: any = await AuthRepo.findUserByGoogleId(googleId);
        
        if (!user && email) {
            // Check if user exists by email but not linked to google
            user = await AuthRepo.findUserByEmail(email);
            if (user) {
                // Link google account to existing user
                user.googleId = googleId;
                await user.save();
            } else {
                // Create new user
                user = await AuthRepo.CreateUser({
                    username: name || email.split('@')[0],
                    email,
                    googleId,
                    provider: 'google',
                    password: null,
                });
            }
        }
        
        if (!user) {
            throw new Error('Failed to process Google authentication');
        }

        const token = this.generateJWT(user);
        return { message: 'Google authentication successful', user, token };
    }

    generateJWT(user: any) {
        const secret = process.env.JWT_SECRET || 'fallback_secret';
        return jwt.sign({ id: user.id, email: user.email, username: user.username }, secret, {
            expiresIn: '1d',
        });
    }
}

export default new AuthService();
