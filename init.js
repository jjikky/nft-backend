require("./db");
const app = require("./app");
const http = require("http");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || "8080";
app.set("port", PORT);

const server = http.createServer(app);

const handleListening = function () {
  console.log(`✅ Listening on: http://localhost:${PORT}`);
};

server.listen(PORT, handleListening);
