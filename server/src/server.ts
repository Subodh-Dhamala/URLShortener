import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import { AppDataSource } from "./lib/database";

const app = express();
const PORT = process.env.PORT || 4500;

app.use(cors());
app.use(express.json());

import { redis } from './lib/redis';

//redis test
redis.set('test','Hello this is test for upstash redis').then(()=>{
  redis.get('test').then((val)=>{
    console.log('Redis test value: ', val);
  });
});

//health
app.get("/", (req, res) => {
  res.send("Server is working fine!");
});

async function startServer() {
  try {
    await AppDataSource.initialize();
    console.log("DB connected!");

    app.listen(PORT, () => {
      console.log(`Server is listening at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
}

startServer();

export default app;