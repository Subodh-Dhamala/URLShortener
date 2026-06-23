import {
  Controller,
  Post, 
  Get,
  Route,
  Body,
  Path,
  SuccessResponse,
  Res,
  Request,
  TsoaResponse,
  Security,
} from 'tsoa';

import {UrlService} from '../services/UrlService';
import { JwtPayload } from 'jsonwebtoken';
import express from 'express';

interface ShortenRequest {
  originalUrl: string;
}

interface ShortenResponse{
  shortCode: string;
  shortUrl: string;
}

interface StatsResponse{
  shortCode: string,
  originalUrl: string, 
  clicks: number,
  createdAt: Date;
}

const urlService = new UrlService();

@Route('/')
export class UrlController extends Controller {

@Post ('shorten')
@SuccessResponse(201, 'Created')
async shorten(
  @Body() body: ShortenRequest,
  @Res() notFoundResponse: TsoaResponse<400, {error:string}>
): Promise<ShortenResponse> {

try{
  const {shortCode} = await urlService.shorten(body.originalUrl);
  this.setStatus(201);

  return {
        shortCode,
        shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      };
}
catch(e:any){
  return notFoundResponse(400, {error: e.message});
}
}

@Get('{shortCode}')
async redirect(
  @Path() shortCode: string,
  @Res() notFoundResponse: TsoaResponse<404, { error: string }>
): Promise<void> {

  try {
    const originalUrl = await urlService.resolve(shortCode);
    this.setHeader('Location', originalUrl);
    this.setStatus(302);
  } catch {
    return notFoundResponse(404, { error: 'Link not found' });
  }

}

  @Get('{shortCode}/stats')
  async stats(
    @Path() shortCode: string,
    @Res() notFoundResponse: TsoaResponse<404, { error: string }>
  ): Promise<StatsResponse> {
    try {
      const url = await urlService.getStats(shortCode);
      return {
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        clicks: url.clicks,
        createdAt: url.createdAt,
      };
    } catch {
      return notFoundResponse(404, { error: 'Link not found' });
    }
  }


 @Get('my-links')
  @Security('jwt')
  async myLinks(
    @Request() request: express.Request,
    @Res() errorResponse: TsoaResponse<401, { error: string }>
  ): Promise<StatsResponse[]> {
    try {
      const user = (request as any).user as JwtPayload;
      return await urlService.getUserLinks(user.userId);
    } catch {
      return errorResponse(401, { error: 'Unauthorized' });
    }
  }
}
