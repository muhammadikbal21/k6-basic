import http from 'k6/http';
import { sleep, check, fail } from 'k6';
import execution from 'k6/execution'
import { loginUser } from './helper/user.js';
import { createContact } from './helper/contact.js';

export const options = {
  vus: 10,
  duration: '10s'
};

export function setup() {
  const totalContact = Number(__ENV.TOTAL_CONTACT) || 10; 
  // disini kita membuat environment variable dengan nama TOTAL_CONTACT yang mana value default nya adalah 10 jika sistem tidak menemukan variable TOTAL_CONTACT
  // Number disini berfungsi meng-convert environment variable yang tipe data default nya adalah String menjadi Integer
  // kita bisa input valuenya lewat terminal dengan cara ketik "export TOTAL_CONTACT=20" misalnya
  // export TOTAL_CONTACT=20 -> IOS
  // set TOTAL_CONTACT=20 -> Windows Command Prompt
  // maka ia mempunyai value 20, bukan 10
  const data = [];
  for (let i = 0; i < totalContact; i++) {
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
  const loginResponse = loginUser(loginRequest);

  // get profile with token
  const loginBodyResponse = loginResponse.json();
  return loginBodyResponse.token;
}

export default function(data) {
  const token = getToken();
  for (let i = 0; i < data.length; i++) {
    const contact = data[i];
    createContact(token, contact);
  }
}

export function teardown(data) {
  console.info(`Finish create ${data.length} contacts`);
}
