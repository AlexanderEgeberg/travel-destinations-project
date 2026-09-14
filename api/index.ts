import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pgp from "pg-promise";
import dotenv from "dotenv";
import { db } from "./src/prisma/db.ts";
import authRouter, { authenticateToken } from "./routes/auth.ts";

import * as z from "zod";

const TravelDestination = z
  .object({
    title: z.string().min(1),
    dateFrom: z.string().min(1),
    dateTo: z.string().min(1),
    description: z.string().optional().nullable(),
    imgSrc: z
      .url()
      .refine((url) => /\.(png|jpe?g)$/i.test(new URL(url).pathname), {
        error: "Image link must point to a .png, .jpg, or .jpeg file",
      }),
    location: z.string().min(1),
    country: z.string().min(1),
    createdAt: z.string().min(1).optional(),
  })
  .strict();

const TravelDestinationParams = z
  .object({
    id: z.string().min(1),
  })
  .strict();

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3010;

app.use(express.json());
app.use(cors());
app.use(authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing DATABASE_URL in environment variables");
}

// const pg = pgp();
// const pgdatabase = pg(connectionString);

// app.get("/users", async (req: Request, res: Response) => {
//   const users = await pgdatabase.manyOrNone("SELECT * FROM users");

//   console.log("users", users);
//   res.json({
//     users,
//   });
// });

app.get("/travel_destination/:id", async (req: Request, res: Response) => {
  const parsedParams = await TravelDestinationParams.safeParseAsync(req.params);

  if (!parsedParams.success) {
    return res.status(400).json({
      error: "Invalid request params",
      details: parsedParams.error.flatten(),
    });
  }

  const travel = await db.orm.public.TravelDestination.first({
    id: Number(parsedParams.data.id),
  });

  res.status(200).json({
    travel,
  });
});
app.get("/travel_destinations", async (req: Request, res: Response) => {
  const travels = await db.orm.public.TravelDestination.all();

  res.status(200).json({
    travels,
  });
});

app.post("/travel_destination", async (req: Request, res: Response) => {
  const parsed = await TravelDestination.safeParseAsync(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body",
      details: parsed.error.flatten(),
    });
  }

  const travelDestination = await db.orm.public.TravelDestination.create(
    parsed.data,
  );

  return res.status(200).json({
    travelDestination,
  });
});

app.put("/travel_destination/:id", async (req: Request, res: Response) => {
  const parsed = await TravelDestination.safeParseAsync(req.body);

  const parsedParams = await TravelDestinationParams.safeParseAsync(req.params);

  if (!parsedParams.success) {
    return res.status(400).json({
      error: "Invalid request params",
      details: parsedParams.error.flatten(),
    });
  }

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid request body",
      details: parsed.error.flatten(),
    });
  }

  const travelDestination = await db.orm.public.TravelDestination.where({
    id: Number(parsedParams.data.id),
  }).update(parsed.data);

  return res.status(200).json({
    travelDestination,
  });
});

app.delete(
  "/travel_destination/:id",
  authenticateToken,
  async (req: Request, res: Response) => {
    const parsedParams = await TravelDestinationParams.safeParseAsync(
      req.params,
    );

    if (!parsedParams.success) {
      return res.status(400).json({
        error: "Invalid request params",
        details: parsedParams.error.flatten(),
      });
    }

    const travelDestination = await db.orm.public.TravelDestination.where({
      id: Number(parsedParams.data.id),
    }).delete();

    // plain SQL
    // const plan = db.raw.sql`
    // DELETE FROM "TRAVEL_DESTINATIONS"
    // WHERE "ID" = ${Number(parsedParams.data.id)}
    // `
    //   .affectedCount()
    //   .build();

    // const result = await db.runtime().execute(plan);

    return res.status(200).json({
      travelDestination,
    });
  },
);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
