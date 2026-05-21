import { login, register, googleLogin } from '../controllers/AuthController.js';

export default {
    auth: {
        login: {
            method: 'post',
            controller: login,
        },
        register: {
            method: 'post',
            controller: register,
        },
        google: {
            method: 'post',
            controller: googleLogin,
        }
    }
};

