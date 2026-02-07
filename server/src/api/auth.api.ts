
import { login, register } from '../controllers/AuthController.js';

export default {
    auth: {
        login: {
            method: 'post',
            controller: login,
        },
        register: {
            method: 'post',
            controller: register,
        }
    }
};

