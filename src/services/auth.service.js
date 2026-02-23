import axios from 'axios';
import customAxios from './middleware.js';

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const login = async (payload) => customAxios.post('auth/login', payload)
export const refreshTokenService = async (payload) => customAxios.post('auth/refresh-token', payload);
export const Signup = async (payload) => customAxios.post('auth/signup', payload);
export const ForgotPassword = async (payload) => axios.post(`${baseURL}/auth/forgot-password`, payload);
export const ResetPassword = async (payload) => axios.post(`${baseURL}/auth/reset-password`, payload);
export const googleLogin = async (payload) => customAxios.post('auth/google/login', payload);