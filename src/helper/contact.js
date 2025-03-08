import http from "k6/http";
import { check } from "k6";
import { BASE_URL } from "./baseUrl.js";



export function createContact(token, contact) {
    const response = http.post(`${BASE_URL}/contacts`, JSON.stringify(contact), {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    check(response, {
        'create contact status is 201': (response) => response.status === 201
    });

    return response;
}