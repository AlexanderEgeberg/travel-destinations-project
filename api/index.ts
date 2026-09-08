import express, { type Express, type Request, type Response } from "express";
import pgp from "pg-promise";
import dotenv from "dotenv";
import { db } from "./src/prisma/db.ts";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL in environment variables");
}

const pg = pgp();
const pgdatabase = pg(connectionString);

app.get("/users", async (req: Request, res: Response) => {
  const users = await pgdatabase.manyOrNone("SELECT * FROM users");

  console.log("users", users);
  res.json({
    users,
  });
});

app.get("/prisma", async (req: Request, res: Response) => {
  const users = await db.orm.public.User.all();

  res.json({
    users,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
