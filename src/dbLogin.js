import execution from 'k6/execution'
import { getUser, loginUser } from './helper/user.js';

export const options = {
  vus: 10,
  duration: '10s'
};

export default function() {
  // login
  // menggunakan execution sebagai unique emailnya
  // disini kita create akun atau registrasi nya menggunakan script yang sudah dibuat di postman
  const email = `muhammadikbal${execution.vu.idInInstance}@example.com`;
  const loginRequest = {
    email: email,
    password: '123456'
  }
  const loginResponse = loginUser(loginRequest);

  // get profile with token
  const loginBodyResponse = loginResponse.json();
  getUser(loginBodyResponse.token);
}
