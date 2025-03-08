import http from 'k6/http';
import { sleep, check, fail } from 'k6';
import execution from 'k6/execution'

export const options = {
  vus: 10,
  duration: '10s'
};

const BASE_URL = 'http://localhost:3001';

export function setup() {
  const data = [];
  for (let i = 0; i < 10; i++) {
    data.push({
      "firstName" : "Kontak",
      "lastName" : `Ke-${i}`,
      "email" : `contact${i}@example.com`
    });
  }
  return data;
}

export function getToken() {
  // login
  const email = `muhammadikbal${execution.vu.idInInstance}@example.com`;
  const loginRequest = {
    email: email,
    password: '123456'
  }
  const loginResponse = http.post(`${BASE_URL}/login`, JSON.stringify(loginRequest), {
    headers: {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
    }
  }); 
  check(loginResponse, {
    'login response is 200': (response) => response.status === 200,
    'login response token must exist': (response) => response.json().token != null
  });

  // get profile with token
  const loginBodyResponse = loginResponse.json();
  return loginBodyResponse.token;
}

export default function(data) {
  const token = getToken();
  for (let i = 0; i < data.length; i++) {
    const contact = data[i];
    const response = http.post(`${BASE_URL}/contacts`, JSON.stringify(contact), {
      headers: {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json',
        'Authorization' : `Bearer ${token}`
      }
    });
    check(response, {
      'create contact status is 201' : (response) => response.status === 201
    });
  }
}

export function teardown(data) {
  console.info(`Finish create ${data.length} contacts`);
}
