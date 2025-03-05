import http from 'k6/http';
import { sleep, check, fail } from 'k6';

export const options = {
  vus: 10,
  duration: '10s'
};


export default function() {
  // register
  const uniqueId = new Date().getTime();
  const registerRequest = {
    username: `user-${uniqueId}`,
    fullName: `MuhammadIkbal-${uniqueId}`,
    email: `muhammadikbal${uniqueId}@gmail.com`,
    password: '123456'
  }
  const registerResponse = http.post('http://localhost:3001/register/', JSON.stringify(registerRequest), {
    headers: {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
    }
  });
  if (registerResponse.status !== 200) {
    fail(`Failed to register user-${uniqueId}`)
  }
  
  // login
  const loginRequest = {
    email: `muhammadikbal${uniqueId}@gmail.com`,
    password: '123456'
  }
  const loginResponse = http.post('http://localhost:3001/login/', JSON.stringify(loginRequest), {
    headers: {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
    }
  }); 
  if (loginResponse.status !== 200) {
    fail(`Failed to login user-${uniqueId}`)
  }

  // get profile with token
  const loginBodyResponse = loginResponse.json();
  const currentResponse = http.get('http://localhost:3001/profile/', {
    headers: {
      'Accept' : 'application/json',
      'Authorization' : `Bearer ${loginBodyResponse.token}`
    }
  });
  if (currentResponse.status !== 200) {
    fail(`Fail to get user-${uniqueId}`)
  }
}
