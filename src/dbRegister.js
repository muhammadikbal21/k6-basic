import http from 'k6/http';
import { sleep, check, fail } from 'k6';

export const options = {
  vus: 10,
  duration: '10s'
};

const BASE_URL = 'http://localhost:3001';

export default function() {
  // register
  const uniqueId = new Date().getTime();
  const registerRequest = {
    username: `user-${uniqueId}`,
    fullName: `MuhammadIkbal-${uniqueId}`,
    email: `muhammadikbal${uniqueId}@gmail.com`,
    password: '123456'
  }
  const registerResponse = http.post(`${BASE_URL}/register`, JSON.stringify(registerRequest), {
    headers: {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
    }
  });
  const checkRegister = check(registerResponse, {
    'register response is 201': (response) => response.status === 201,
    'register response is 400': (response) => response.status === 400,
    'register response data must not null': (response) => response.json() != null
  });
  // karena disini ada validasi menggunakan fail(), maka code check() dibawah tidak akan dijalankan
  // tapi jika tidak ada validasi menggunakan fail(), code check() akan dijalankan 
  if (!checkRegister) {
    fail(`Failed to register user-${uniqueId}`)
  }
  
  // login
  const loginRequest = {
    email: `muhammadikbal${uniqueId}@gmail.com`,
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
    fail(`Failed to login user-${uniqueId}`)
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
    fail(`Fail to get user-${uniqueId}`)
  }
}
