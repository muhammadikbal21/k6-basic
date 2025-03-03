import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  // disini kita akan meng-simulasikan load test dengan beban naik-turun menggunakan stages
  stages: [
    {duration: '10s', target: '10'},
    {duration: '10s', target: '0'},
    {duration: '10s', target: '20'},
    {duration: '10s', target: '10'},
    {duration: '10s', target: '0'},
    {duration: '10s', target: '50'},
    {duration: '10s', target: '5'},
    {duration: '10s', target: '0'},
  ]
};


export default function() {
  let res = http.get('https://test-api.k6.io');
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1); 
}
