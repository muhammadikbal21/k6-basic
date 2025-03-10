import axios from "axios";

// ini adalah script untuk create user langsung dengan cara menjalankannya di terminal jika diperlukan
async function registerUser(i) {
    const requestBody = {
        username: `ikbal${i}`,
        fullName: `MuhammadIkbal${i}`,
        email: `muhammadikbal${i}@example.com`,
        password: "123456"
    };

    try {
        const res = await axios.post("http://localhost:3001/register", requestBody, {
            headers: { "Content-Type": "application/json" }
        });

        console.log(`User ${i} registered!`, res.data);
    } catch (err) {
        console.log(`Error registering user ${i}:`, err.response ? err.response.data : err.message);
    }

    if (i < 10) {
        setTimeout(() => registerUser(i + 1), 500); // Delay 500ms sebelum request berikutnya
    }
}

// Mulai dari user pertama
registerUser(1);
