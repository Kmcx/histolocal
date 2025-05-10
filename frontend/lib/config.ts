const HOST = process.env.EXPO_PUBLIC_HOST_IP;
const API_PORT = process.env.EXPO_PUBLIC_API_PORT;
const AI_PORT = process.env.EXPO_PUBLIC_AI_PORT;

export const API_URL = `http://${HOST}:${API_PORT}`;
export const AI_URL = `http://${HOST}:${AI_PORT}`;
