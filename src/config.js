// src/config.js

export const API_BASE = "https://meme-server.onrender.com"; // ✅ Change to deployed backend URL

// Auth Endpoints
export const SIGNUP_URL = `${API_BASE}/auth/signup`;
export const LOGIN_URL = `${API_BASE}/auth/login`;

// Meme Generator Endpoint
export const GENERATE_MEME_URL = `${API_BASE}/generate`;

// Update Endpoint
export const UPDATE_USER_URL = `${API_BASE}/update`;