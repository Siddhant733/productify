import type { Request, Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

export const syncUser = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const email = req.body?.email?.trim();
    const name = req.body?.name?.trim();
    const imageUrl = req.body?.imageUrl?.trim();

    if (!email || !name || !imageUrl) {
      return res.status(400).json({
        error: "Email, name, and imageUrl are required",
      });
    }

    const user = await queries.upsertUser({
      id: userId,
      email,
      name,
      imageUrl,
    });

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error syncing user:", error);
    return res.status(500).json({ error: "Failed to sync user" });
  }
};