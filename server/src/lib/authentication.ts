import jwt from 'jsonwebtoken';
import {Request} from 'express';

export interface JwtPayload{
  userId: string;
  email: string;
}

export async function expressAuthentication(
  request:Request,
  securityName: string,
): Promise<JwtPayload | undefined>{

  if(securityName === 'jwt'){
    const authHeader = request.headers['authorization'];
    if(!authHeader) throw new Error('No token provided');

    const token = authHeader.split(' ')[1];
    if(!token) throw new Error('No token provided');

    try{
      const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload;
      (request as any).user = decoded;
      return decoded;
    }
    catch{
      throw new Error('Invalid token');
    }
  }
  // when the token is missing or invalid — user is anonymous
  if(securityName === 'jwt_optional'){
    const authHeader = request.headers['authorization'];
    if(!authHeader) return undefined;

    const token = authHeader.split(' ')[1];
    if(!token) return undefined;

    try{
      const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JwtPayload;
      (request as any).user = decoded;
      return decoded;
    }
    catch{
      return undefined;
    }
  }

  throw new Error('Unknown security');
}