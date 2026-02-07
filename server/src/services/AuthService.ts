
import AuthRepo from '../repositories/AuthRepo.js';

class AuthService {
    async login(email: string) {
        // Business logic
        const user = await AuthRepo.findUserByEmail(email);
        if (!user) {
            throw new Error('User not found');
        }
        return { message: 'Login successful', userId: user.id };
    }

    async register(userData: any) {
        const existingUser = await AuthRepo.findUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const newUser = await AuthRepo.CreateUser(userData);
        return { message: 'User created', userId: newUser.id };
    }
}

export default new AuthService();

