import execution from "k6/execution";
import { loginUser, registerUser } from "./helper/user.js";
import { createContact } from "./helper/contact.js";
import { Counter } from "k6/metrics";
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
    thresholds: {
        user_registration_counter_success: ['count > 190'], // disini kita bikin thresholds jika jumlah nya lebih besar dari 190, dia akan sukses dan muncul tanda centang
        user_registration_counter_error: ['count < 1'] // disini kita bikin thresholds jika jumlah nya lebih kecil dari 1, dia akan gagal/error dan muncul tanda silang
    },
    scenarios: {
        userRegistration: { // ini adalah nama scenario nya
            exec: "userRegistration", // ini memanggil nama function dibawah
            executor: "shared-iterations", // ini jenis executor
            vus: 10,
            iterations: 200,
            maxDuration: "30s"
        },
        contactCreation: {
            exec: "contactCreation",
            executor: "constant-vus",
            vus: 10,
            duration: "10s"
        }
    }
}

const registerCounterSuccess = new Counter("user_registration_counter_success"); // string di dalam kurung adalah nama metric yang akan tampil di output result nya
const registerCounterError = new Counter("user_registration_counter_error");

export function userRegistration() {
    const uniqueId = uuidv4(); // ini adalah library k6 yang telah kita import, berfungsi untuk mendapatkan unique number
    const registerRequest = {
        username: `user-${uniqueId}`,
        fullName: `MuhammadIkbal-${uniqueId}`,
        email: `muhammadikbal${uniqueId}@gmail.com`,
        password: '123456'
    }
    const response = registerUser(registerRequest);

    if (response.status === 201) {
        registerCounterSuccess.add(1);
    } else {
        registerCounterError.add(1);
    }
}

export function contactCreation() {
    const number = (execution.vu.idInInstance % 9) + 1; // ini adalah code untuk mendapatkan value 1-9
    /* 
        kenapa pakai modulus 9 + 1?
        ✅ Supaya user yang login pakai email muhammadikbalX@example.com hanya punya 9 variasi (1-9).
        ✅ Menghindari terlalu banyak user unik, sehingga tes lebih realistis (misal dalam skenario shared users).
        ✅ Kalau pakai ID langsung, bisa terus bertambah tanpa batas, bikin banyak akun tidak perlu.
    */
    const email = `muhammadikbal${number}@example.com`;
    const loginRequest = {
        email: email,
        password: '123456'
    }

    const loginResponse = loginUser(loginRequest); // function loginUser me-return object token yang mana berasal dari endpoint /login yg ada di server.js
    const token = loginResponse.json().token;

    const contact = {
        "firstName": `Kontak-${execution.vu.idInInstance}`,
        "lastName": `Ke-${execution.vu.idInInstance}`,
        "email": `contact-${execution.vu.idInInstance}@example.com`
    };
    createContact(token, contact);
}