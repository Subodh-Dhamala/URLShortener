import {
  Controller,
  Post,
  Get,
  Route,
  Body,
  Path,
  SuccessResponse,
  Res,
  TsoaResponse,
  Request,
  Security,
} from 'tsoa';
import { UrlService } from '../services/UrlService';
import { JwtPayload } from '../lib/authentication';
import express from 'express';

interface ShortenRequest {
  originalUrl: string;
}

interface ShortenResponse {
  shortCode: string;
  shortUrl: string;
}

interface StatsResponse {
  shortCode: string;
  originalUrl: string;
  clicks: number;
  createdAt: Date;
}

const urlService = new UrlService();

@Route('/')
export class UrlController extends Controller {

  @Post('shorten')
  @Security('jwt_optional')
  @SuccessResponse(201, 'Created')
  async shorten(
    @Body() body: ShortenRequest,
    @Request() request: express.Request,
    @Res() errorResponse: TsoaResponse<400, { error: string }>
  ): Promise<ShortenResponse> {
    try {
      const user = (request as any).user as JwtPayload | undefined;
      const userId = user?.userId ?? null;

      console.log('user from request:', user);
      console.log('userId:', userId);

      const { shortCode } = await urlService.shorten(body.originalUrl, userId);
      this.setStatus(201);
      return {
        shortCode,
        shortUrl: `${process.env.BASE_URL}/${shortCode}`,
      };
    } catch (err: any) {
      return errorResponse(400, { error: err.message });
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

  @Get('urls/my-links')
  @Security('jwt')
  async myLinks(
    @Request() request: express.Request,
    @Res() errorResponse: TsoaResponse<401, { error: string }>
  ): Promise<StatsResponse[]> {
    try {
      const user = (request as any).user as JwtPayload;
      console.log('myLinks user:', user);
      const links = await urlService.getUserLinks(user.userId);
      return links.map(url => ({
        shortCode: url.shortCode,
        originalUrl: url.originalUrl,
        clicks: url.clicks,
        createdAt: url.createdAt,
      }));
    } catch {
      return errorResponse(401, { error: 'Unauthorized' });
    }
  }
}