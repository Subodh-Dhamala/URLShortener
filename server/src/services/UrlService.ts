import { AppDataSource } from "../lib/database";
import {redis} from '../lib/redis';
import { Url } from "../entities/Url";
import { generateShortCode } from "../lib/shortcode";

export class UrlService {
  private repo = AppDataSource.getRepository(Url);

  async shorten(originalUrl: string):Promise<{shortCode:string}>{

    //validate URL
    try{
      new URL(originalUrl);
    } catch{
      throw new Error('Invalid URL');
    }

    const shortCode = await generateShortCode();

    const url = this.repo.create({shortCode, originalUrl});
    await this.repo.save(url);

    //cache immediately
    await redis.set(`url:${shortCode}`, originalUrl, {ex:3600});

    return {shortCode};;

  }

  async resolve(shortCode: string): Promise <string>{
    //check cache first
     const cached = await redis.get<string>(`url:${shortCode}`);
     if(cached) {
      await this.repo.increment({shortCode}, 'clicks', 1);
      return cached;
     }

     //cache miss case - hit the DB
     const url = await this.repo.findOne({
      where: {shortCode}
     });
     if(!url) throw new Error('Url not found!');


     //store in cache for next use
     await redis.set(`url:${shortCode}`,url.originalUrl, {ex:3600});
     await this.repo.increment({shortCode},'clicks',1);
     
     return url.originalUrl;

  }

  async getStats(shortCode:string ): Promise <Url> {
    const url = await this.repo.findOne({
      where: {shortCode}
    });

    if(!url) throw new Error('Url not found!');

    return url;
  }

}