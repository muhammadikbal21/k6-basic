import http from "k6/http";
import { check } from "k6";
import { BASE_URL } from "./baseUrl.js";



export function registerUser(body) {
    const registerResponse = http.post(`${BASE_URL}/register`, JSON.stringify(body), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    check(registerResponse, {
        'register response is 201': (response) => response.status === 201,
        'register response is 400': (response) => response.status === 400,
        'register response data must not null': (response) => response.json() != null
    });

    return registerResponse;
}

export function loginUser(body) {
    const loginResponse = http.post(`${BASE_URL}/login`, JSON.stringify(body), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
    check(loginResponse, {
        'login response is 200': (response) => response.status === 200,
        'login response token must exist': (response) => response.json().token != null
    });

    return loginResponse;
}

export function getUser(token) {
    const currentResponse = http.get(`${BASE_URL}/profile`, {
        headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    check(currentResponse, {
        'current response is 200': (response) => response.status === 200,
        'current response is 401': (response) => response.status === 401,
        'current response is 403': (response) => response.status === 403,
        'current response data must not null': (response) => response.json() != null
    });

    return currentResponse;
}