import bodyParser from "body-parser";
import cors from "cors";
// Express App Setup
import express from "express";
// Postgre Client Setup
import { Pool } from "pg";
import redis from "redis";
import keys from "./keys";

const app = express();

app.use(cors());

app.use(bodyParser.json());

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: Number(keys.pgPort),
});

pgClient.on("error", () => {
  console.log("Lost pg connection");
});

pgClient.on("connect", () => {
  pgClient
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((error) => console.log(error));
});

// Redis Client Setup
const redisClient = redis.createClient({
  host: keys.redisHost,
  port: Number(keys.redisPort),
  retry_strategy: () => 1000, // retry if it loses connection every 1sec
});

// We are doing this duplication because according to the
// redis documentation for javascript, if we ever have a client that is
// publishing or listening, we have to make a duplicate connection
// because once a client is used for publishing or listening, it cannot be used for
// other purposes
const redisPublisher = redisClient.duplicate();

// Express route handlers
app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");

  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (error, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }

  redisClient.hset("values", index, "Nothing yet!");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening");
});
