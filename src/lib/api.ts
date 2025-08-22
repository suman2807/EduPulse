import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const api = axios.create({
	baseURL: API_BASE_URL,
});

const existingToken = localStorage.getItem('token');
if (existingToken) {
	api.defaults.headers.common['Authorization'] = `Bearer ${existingToken}`;
}

export function setAuthToken(token: string | null) {
	if (token) {
		localStorage.setItem('token', token);
		api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	} else {
		localStorage.removeItem('token');
		delete api.defaults.headers.common['Authorization'];
	}
}

export function setupAuthInterceptor(onUnauthorized: () => void) {
	api.interceptors.response.use(
		(response) => response,
		(error) => {
			if (error?.response?.status === 401) {
				onUnauthorized();
			}
			return Promise.reject(error);
		}
	);
}
