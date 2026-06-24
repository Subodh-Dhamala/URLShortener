'use client';

import {useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {login as loginApi} from '@/lib/api';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {jwtDecode} from 'jwt-decode';


export default function LoginPage(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {login} = useAuth();
  const router = useRouter();

  const handleLogin = async ()=>{
    setError('');
    setIsLoading(true);
    
    try{
      const {token} = await loginApi(email,password);
      const decoded = jwtDecode<{email:string}>(token);
      login(token,decoded.email);
      router.push('/dashboard');
    }
    catch(err:any){
      setError(err.response?.data?.error || 'Something went wrong!');
    }

    finally{
     setIsLoading(false);
  }

};



return(
  <div>
    <h1>Welcome Back</h1>
    
    Login<input type="email" 
    value={email}
    onChange={(e)=>setEmail(e.target.value)} />
    
    password<input type='password' 
    value={password} 
    onChange={(e)=>setPassword(e.target.value)}
    placeholder='***********'
    onKeyDown={(e)=>e.key === 'Enter' && handleLogin()}
    />

  {error && <p className='text-red-500'>{error}</p>}


  <button 
  onClick={handleLogin}
  disabled = {isLoading || !email || !password}

>
    {isLoading ? 'Logging in...' : 'Login'}
  </button>

  <p>NO ACCOUNT?</p>
  <Link href='/register' className='hover:underline'>
    Sign Up
  </Link>



  </div>
)












}
 