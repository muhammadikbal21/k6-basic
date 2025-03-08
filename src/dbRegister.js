import { getUser, loginUser, registerUser } from './helper/user.js';

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
  registerUser(registerRequest);
  
  // login
  const loginRequest = {
    email: `muhammadikbal${uniqueId}@gmail.com`,
    password: '123456'
  }
  const loginResponse = loginUser(loginRequest);

  // get profile with token
  const loginBodyResponse = loginResponse.json();
  getUser(loginBodyResponse.token);
}
