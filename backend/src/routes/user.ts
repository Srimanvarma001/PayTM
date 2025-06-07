import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { User, Account } from "../db";
import { JWT_SECRET } from "../config";
import { authMiddleware } from "../middleware";

const router = express.Router(); 6


const signupSchema = z.object({
  username: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(6),
});

const signinSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

const updateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(6),
});

//@ts-ignore
router.post("/signup", async (req, res) => {
  const result = signupSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.format() });

  const { username, firstName, lastName, password } = result.data;
  if (await User.exists({ username }))
    return res.status(409).json({ message: "Email already taken" });

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, firstName, lastName, password: hashed });
  await Account.create({ userId: user._id, balance: Math.random() * 10000 + 1 });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  return res.status(201).json({ message: "Created", token });
});


//@ts-ignore


router.post("/signin", async (req, res) => {
  const result = signinSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.format() });

  const { username, password } = result.data;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  return res.json({ token });
});

//@ts-ignore

router.put("/", authMiddleware, async (req: Request, res: Response) => {
  const result = updateSchema.safeParse(req.body);
  if (!result.success)
    return res.status(400).json({ errors: result.error.format() });

  const update = {
    ...result.data,
    password: await bcrypt.hash(result.data.password, 10)
  };
  //@ts-ignore

  await User.updateOne({ _id: req.userId! }, update);
  return res.json({ message: "Updated successfully" });
});

//@ts-ignore

router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Send back user details
    res.json({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      id: user._id
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user details"
    });
  }
});

//@ts-ignore
router.get("/bulk", authMiddleware, async (req: Request, res: Response) => {
  try {
    const filter = req.query.filter as string || "";
    const users = await User.find({
      $or: [
        { firstName: { $regex: filter, $options: "i" } },
        { lastName: { $regex: filter, $options: "i" } },
      ]
    }).select('firstName lastName _id'); // Only select needed fields

    res.json({
      users: users.map(u => ({
        _id: u._id,
        firstName: u.firstName,
        lastName: u.lastName
      }))
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching users",
      users: []
    });
  }
});


export default router;
