const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const router = require("./routes");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const websocket = require("./webSocket");

const url = "mongodb://localhost:27017";
const dbName = "interview_fox";
const client = new MongoClient(url, {
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(router);

async function run() {
  try {
    await client.connect();
    const db = client.db(dbName);
    console.log(`Connected to database: ${db.databaseName}`);
    app.locals.db = db;
    websocket(db, io);
    http.listen(8000, () => {
      console.log("Listening on 8000");
    });
  } catch (error) {
    console.error(error);
  }
}

run();
