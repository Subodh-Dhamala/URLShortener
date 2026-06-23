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

interface AuthRequest{
  email: string;
  password: string;
}

interface AuthResponse{
  token: string;
}

const authService = new AuthService();


@Route('/auth')
export class AuthController extends Controller{

@Post('register')
@SuccessResponse(201,'Created')
async register(
  @Body() body: AuthRequest,
  @Res() errorResponse: TsoaResponse<400, {error: string}>
): Promise<AuthResponse>{
  try{
    this.setStatus(201);
    return await authService.register(body.email, body.password);
  }
  catch(err:any){
    return errorResponse(400,{error: err.message});
  }
}



@Post('login')
async login(
  @Body() body: AuthRequest,
  @Res() errorResponse: TsoaResponse<400, {error:string}>
): Promise<AuthResponse> {

try{
  return await authService.login(body.email, body.password);
}

catch(err:any){
  return errorResponse(400,{error:err.message});
}

}

}