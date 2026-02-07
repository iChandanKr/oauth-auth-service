
import User from '../models/User.js';

class AuthRepo {
    findUserByEmail(email: string) {
        return User.findOne({ where: { email } });
    }

    CreateUser(userData: any) {
        return User.create(userData);
    }
}

export default new AuthRepo();

