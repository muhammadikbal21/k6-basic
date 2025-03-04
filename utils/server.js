import jsonServer from "json-server";
import jwt from "jsonwebtoken";
import fs from "fs";
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Reset db.json sebelum server jalan
fs.copyFileSync("db-backup.json", "db.json");
console.log("Database reset to initial state.");

server.use(jsonServer.bodyParser);
server.use(middlewares);

const SECRET_KEY = "secret123"; // Kunci rahasia buat JWT

// Register (Menyimpan User Baru)
server.post("/register", (req, res) => {
  const { username, fullName, email, password } = req.body;
  const db = router.db.getState();

  if (db.users.some((user) => user.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: db.users.length + 1,
    username,
    fullName,
    email,
    password,
    token: jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" })
  };

  db.users.push(newUser);
  router.db.write();

  res.status(201).json(newUser);
});

// Login (Mendapatkan Token)
server.post("/login", (req, res) => {
  const { email, password } = req.body;
  const db = router.db.getState();

  const user = db.users.find((user) => user.email === email && user.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
  user.token = token;
  router.db.write();

  res.json({ token });
});

// Protected Route (Cek Token)
server.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    res.json({ message: "Welcome to your profile!", email: decoded.email });
  });
});

server.use(router);
server.listen(3001, () => {
  console.log("JSON Server with JWT running on http://localhost:3001");
});
