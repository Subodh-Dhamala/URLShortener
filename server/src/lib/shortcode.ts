import { randomInt } from "crypto";
import { AppDataSource } from "./database";
import { Url } from "../entities/Url";

export async function generateShortCode(): Promise<string> {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  const repo = AppDataSource.getRepository(Url);

  while (true) {
    let code = "";

    for (let i = 0; i < 7; i++) {
      const index = randomInt(0, chars.length);
      code += chars[index];
    }

    const existing = await repo.findOne({
      where: { shortCode: code },
    });

    if (!existing) return code;
  }
}