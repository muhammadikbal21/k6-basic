import http from 'k6/http';
import { sleep, check } from 'k6';

// options adalah variable yang digunakan untuk melakukan pengaturan, misalnya jumlah virtual user (VU) dan berapa lama durasi pengujian
export const options = {
  vus: 10, // virtual user sebanyak 10 user
  duration: '10s', // durasi 10 detik
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'] // summary statistic berguna untuk menambah atau mengatur output apa saja yang ingin kita tampilkan/simpan ke report
  // p(90) dst. adalah persentil, maksudnya adalah di persentase 90/95/95 ini response time nya di berapa detik
};

// Default function adalah function yang dijalankan oleh K6 sesuai dengan pengaturan di variable options 
// Default function akan berisi kode untuk melakukan skenario performance testing
export default function() {
  let res = http.get('https://test-api.k6.io');
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1); // ini menunda 1 detik ketika sukses nge-hit endpointnya
}
