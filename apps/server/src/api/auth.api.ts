import { login, register, googleLogin } from '../controllers/auth.controller.js';
import { validateRequestBody } from '../middleware/validate-request.middleware.js';
import { googleLoginSchema, loginSchema, registerSchema } from '../validations/auth.validation.js';

export default {
    auth: {
        login: {
            method: 'post',
            middleware: [validateRequestBody(loginSchema)],
            controller: login,
        },
        register: {
            method: 'post',
            middleware: [validateRequestBody(registerSchema)],
            controller: register,
        },
        google: {
            method: 'post',
            middleware: [validateRequestBody(googleLoginSchema)],
            controller: googleLogin,
        }
    }
};
