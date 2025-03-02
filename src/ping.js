import http from 'k6/http';
import { sleep, check } from 'k6';

// options adalah variable yang digunakan untuk melakukan pengaturan, misalnya jumlah virtual user (VU) dan berapa lama durasi pengujian
export const options = {
  vus: 10, // virtual user sebanyak 10 user
  duration: '30s', // durasi 30 detik
};

// Default function adalah function yang dijalankan oleh K6 sesuai dengan pengaturan di variable options 
// Default function akan berisi kode untuk melakukan skenario performance testing
export default function() {
  let res = http.get('https://test-api.k6.io');
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1); // ini menunda 1 detik ketika sukses nge-hit endpointnya
}
