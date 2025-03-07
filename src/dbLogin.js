import http from 'k6/http';
import { sleep, check, fail } from 'k6';
import execution from 'k6/execution'

export const options = {
  vus: 10,
  duration: '10s'
};

const BASE_URL = 'http://localhost:3001';

export default function() {
  // login
  // menggunakan execution sebagai unique emailnya
  // disini kita create akun atau registrasi nya menggunakan script yang sudah dibuat di postman
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
  const checkLogin = check(loginResponse, {
    'login response is 200': (response) => response.status === 200,
    'login response token must exist': (response) => response.json().token != null
  });
  if (!checkLogin) {
    fail(`Failed to login ${email}`)
  }

  // get profile with token
  const loginBodyResponse = loginResponse.json();
  const currentResponse = http.get(`${BASE_URL}/profile`, {
    headers: {
      'Accept' : 'application/json',
      'Authorization' : `Bearer ${loginBodyResponse.token}`
    }
  });
  const checkCurrent = check(currentResponse, {
    'current response is 200': (response) => response.status === 200,
    'current response is 401': (response) => response.status === 401,
    'current response is 403': (response) => response.status === 403,
    'current response data must not null': (response) => response.json() != null
  });
  if (!checkCurrent) {
    fail(`Fail to get ${email}`)
  }
}
