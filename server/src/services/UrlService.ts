import { AppDataSource } from "../lib/database";
import { redis } from "../lib/redis";
import { Url } from "../entities/Url";
import { generateShortCode } from "../lib/shortcode";

export class UrlService {
  private repo = AppDataSource.getRepository(Url);

  async shorten(
    originalUrl: string,
    userId: string | null,
    customCode?: string | null,
    expiresAt?: Date,
  ): Promise<{ shortCode: string }> {
    //validate URL
    try {
      new URL(originalUrl);
    } catch {
      throw new Error("Invalid URL");
    }

    let shortCode: string;

    if (customCode) {
     if (!/^[A-Za-z0-9-]{3,20}$/.test(customCode)) {
  throw new Error("Custom code must be 3–20 characters (letters, numbers, hyphens)");
}

      const existing = await this.repo.findOne({
        where: { shortCode: customCode },
      });

      if (existing) {
        throw new Error("This code already exists, try a new one!");
      }

      shortCode = customCode;
    } else {
      shortCode = await generateShortCode();
    }

    const url = this.repo.create({ shortCode, originalUrl, userId, expiresAt });
    await this.repo.save(url);

    const ttl = expiresAt
      ? Math.floor((expiresAt.getTime() - Date.now()) / 1000)
      : 3600;

    //cache immediately
       if (ttl > 0) {
      await redis.set(`url:${shortCode}`, originalUrl, { ex: ttl });
    }

    return { shortCode };
  }

  async resolve(shortCode: string): Promise<string> {
    //check cache first
    const cached = await redis.get<string>(`url:${shortCode}`);
    if (cached) {
      await this.repo.increment({ shortCode }, "clicks", 1);
      return cached;
    }

    //cache miss case - hit the DB
    const url = await this.repo.findOne({
      where: { shortCode },
    });
    if (!url) throw new Error("Url not found!");

    if (url.expiresAt && url.expiresAt < new Date()) {
      throw new Error("Link has been expired!");
    }

    const ttl = url.expiresAt
      ? Math.floor(url.expiresAt.getDate() - Date.now() / 1000)
      : 3600;

    if (ttl > 0) {
      //store in cache for next use
      await redis.set(`url:${shortCode}`, url.originalUrl, { ex: ttl });
    }

    await this.repo.increment({ shortCode }, "clicks", 1);

    return url.originalUrl;
  }

  async getStats(shortCode: string): Promise<Url> {
    const url = await this.repo.findOne({
      where: { shortCode },
    });

    if (!url) throw new Error("Url not found!");

    return url;
  }

  async getUserLinks(userId: string): Promise<Url[]> {
    return this.repo.find({
      where: { userId },
      order: { createdAt: "DESC" },
    });
  }
}
