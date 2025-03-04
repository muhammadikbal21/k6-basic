import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '10s'
};


export default function() {
  // register
  const uniqueId = new Date().getTime();
  const body = {
    username: `user-${uniqueId}`,
    fullName: `MuhammadIkbal-${uniqueId}`,
    email: `muhammadikbal${uniqueId}@gmail.com`,
    password: '123456'
  }
  http.post('http://localhost:3001/register/', JSON.stringify(body), {
    headers: {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
    }
  });
  
  // login
  const loginBody = {
    email: `muhammadikbal${uniqueId}@gmail.com`,
    password: '123456'
  }
  const response = http.post('http://localhost:3001/login/', JSON.stringify(loginBody), {
    headers: {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
    }
  }); 
  const responseBody = response.json();

  const currentResponse = http.get('http://localhost:3001/profile/', {
    headers: {
      'Accept' : 'application/json',
      'Authorization' : `Bearer ${responseBody.token}`
    }
  });

  const currentBody = currentResponse.json();
}
