
import User from '../models/user.model.js';
import type { CreateUserInput, AuthProvider } from '../types/user.type.js';

class AuthRepo {
    findUserByEmail(email: string) {
        return User.findOne({ where: { email } });
    }

    findUserByProviderId(provider: AuthProvider, providerId: string) {
        return User.findOne({ where: { provider, providerId } });
    }

    CreateUser(userData: CreateUserInput) {
        return User.create(userData);
    }
}

export default new AuthRepo();
