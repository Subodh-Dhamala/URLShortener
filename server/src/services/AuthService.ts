import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {AppDataSource} from '../lib/database';
import { User } from '../entities/User';

export class AuthService{

private repo = AppDataSource.getRepository(User);

async register(email: string, password: string): Promise<{token: string}>{
  const existing = await this.repo.findOne( {
    where: {email}
  })

  if(existing) throw new Error('Email already in use!');

  const hashed = await bcrypt.hash(password,10);
  const user = this.repo.create({email,password:hashed});
  await this.repo.save(user);

  const token = jwt.sign(
    {userId: user.id,
      email:user.email
    },
    process.env.JWT_SECRET!,
    {expiresIn: '7d'}
  );

  return {token}

}


async login(email: string, password: string) : Promise <{token: string}> {
  const user = await this.repo.findOne({where: {email}});
  if(!user) throw new Error('User not found!');

  const valid = await bcrypt.compare(password, user.password);
  if(!valid) throw new Error('Invalid credentials!');


  const token = jwt.sign(
    {userId: user.id,
      email: user.email
    },
    process.env.JWT_SECRET!,
    {expiresIn: '7d'}
  )


  return {token};
}





}