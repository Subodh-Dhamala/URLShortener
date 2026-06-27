import {
  Controller, 
  Post,
  Route, 
  Body,
  Res,
  TsoaResponse,
  SuccessResponse,
} from 'tsoa';

import { AuthService } from '../services/AuthService';

interface RegisterRequest {
  email: string;
  username: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  email: string;
  username: string;
}

const authService = new AuthService();


@Route('/auth')
export class AuthController extends Controller{

@Post('register')
@SuccessResponse(201, 'Created')
async register(
  @Body() body: RegisterRequest,
  @Res() errorResponse: TsoaResponse<400, { error: string }>
): Promise<AuthResponse> {
  try{
    this.setStatus(201);
    return await authService.register(body.email,body.username, body.password);
  }
  catch(err:any){
    return errorResponse(400,{error: err.message});
  }
}



@Post('login')
@SuccessResponse(200, 'OK')
async login(
  @Body() body: LoginRequest,
  @Res() errorResponse: TsoaResponse<400, { error: string }>
): Promise<AuthResponse> {

try{
  return await authService.login(body.email, body.password);
}

catch(err:any){
  return errorResponse(400,{error:err.message});
}

}

}