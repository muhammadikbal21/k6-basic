import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '10s'
};


export default function() {
  const uniqueId = new Date().getTime();
  const body = {
    username: `user-${uniqueId}`,
    firstName: `Muhammad-${uniqueId}`,
    lastName: `Ikbal-${uniqueId}`,
    email: `muhammadikbal${uniqueId}@gmail.com`,
    password: '123456'
  }
  http.post('https://test-api.k6.io/user/register/', JSON.stringify(body), {
    headers: {
      'Accept' : 'application/json',
      'Content-Type' : 'application/json'
    }
  });
}
