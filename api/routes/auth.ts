import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as z from "zod";
import { db } from "../src/prisma/db.ts";

const UserSchema = z
  .object({
    username: z
      .string()
      .min(8)
      .regex(/^[A-Za-z0-9]+$/, "Username can only contain letters and numbers"),
    password: z
      .string()
      .min(12)
      .regex(
        /(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter",
      )
      .regex(/(?=.*\d)/, "Password must contain at least one number"),
    name: z.string(),
    age: z.number().min(13),
  })
  .strict();

const LoginSchema = z
  .object({
    username: z.string().min(1),
    password: z.string().min(1),
  })
  .strict();

type AuthTokenPayload = {
  username: string;
};

const router = express.Router();

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;

  if (!token) {
    return res.status(401).json({
      error: "Missing access token",
    });
  }

  const tokenSecret = process.env.TOKEN_SECRET;

  if (!tokenSecret) {
    return res.status(500).json({
      error: "Missing TOKEN_SECRET",
    });
  }

  try {
    const payload = jwt.verify(token, tokenSecret) as AuthTokenPayload;

    if (!payload.username) {
      return res.status(401).json({
        error: "Invalid token",
      });
    }

    return next();
  } catch {
    return res.status(403).json({
      error: "Invalid token",
    });
  }
};

router.post("/create-user", async (req, res) => {
  try {
    const parsed = await UserSchema.safeParseAsync(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: parsed.error.flatten(),
      });
    }

    const existingUser = await db.orm.public.User.where({
      username: parsed.data.username,
    }).first();

    if (existingUser) {
      return res.status(409).json({
        error: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    const user = await db.orm.public.User.create({
      username: parsed.data.username,
      password: hashedPassword,
      name: parsed.data.name,
      age: parsed.data.age,
    });

    return res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        age: user.age,
        active: user.active,
        createdAt: user.createdAt,
      },
    });
  } catch (e) {
    return res.status(500).json({
      msg: "Failed to create user",
      error: e,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const parsed = await LoginSchema.safeParseAsync(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request body",
        details: parsed.error.flatten(),
      });
    }

    const user = await db.orm.public.User.where({
      username: parsed.data.username,
    }).first();

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const passwordMatches = await bcrypt.compare(
      parsed.data.password,
      user.password,
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const tokenSecret = process.env.TOKEN_SECRET;

    if (!tokenSecret) {
      return res.status(500).json({
        error: "Missing TOKEN_SECRET",
      });
    }

    const accessToken = jwt.sign(
      {
        username: user.username,
      },
      tokenSecret,
    );

    return res.status(200).json({
      accessToken,
    });
  } catch (e) {
    return res.status(500).json({
      error: "Failed to log in",
    });
  }
});

export default router;
