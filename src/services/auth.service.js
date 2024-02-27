import customAxios from './middleware.js';

export const login = async (payload) => {
    return customAxios.post('auth/login', payload)
};
export const refreshTokenService = async (payload) => customAxios.post('auth/refresh-token', payload);
export const Signup = async (payload) => customAxios.post('auth/signup', payload);
export const ForgotPassword = async (payload) => customAxios.post('auth/forgot-password', payload);
export const ResetPassword = async (payload) => customAxios.post('auth/reset-password', payload);
export const googleLogin = async (payload) => customAxios.post('auth/google/login', payload);