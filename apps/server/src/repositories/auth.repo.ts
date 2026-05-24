
import User from '../models/user.model.js';
import type { CreateUserInput } from '../types/user.type.js';

class AuthRepo {
    findUserByEmail(email: string) {
        return User.findOne({ where: { email } });
    }

    findUserByGoogleId(googleId: string) {
        return User.findOne({ where: { googleId } });
    }

    CreateUser(userData: CreateUserInput) {
        return User.create(userData);
    }
}

export default new AuthRepo();
