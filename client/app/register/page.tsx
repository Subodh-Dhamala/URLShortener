'use client';

import {useState} from 'react';
import {useAuth} from '@/context/AuthContext';
import {register as registerApi} from '@/lib/api';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import { jwtDecode } from 'jwt-decode';

export default function RegisterPage(){

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setLoading] = useState(false)
  const {login} = useAuth();
  const router = useRouter();

  const handleRegister = async()=>{
    setError('');
    setLoading(true);
    try{
        const {token} = await registerApi(email,password);
        const decoded = jwtDecode<{email:string}>(token);
        login(token,decoded.email);
        router.push('/dashboard')
    }
    catch(err:any){
      setError(err.response?.data?.error || 'Something went wrong!');
    }

    finally{
      setLoading(false);
    }
  }

return(

<div>
  <h1>Register here</h1>

  Email <input 
  type="email"
  value={email}
  onChange={(e)=>setEmail(e.target.value)}
  placeholder='email@email.com'
  />


  Password
  <input 
  type="password"
  value={password}
  onChange={(e)=>setPassword(e.target.value)}
  onKeyDown={(e)=>e.key === 'Enter' && handleRegister()}
  placeholder='***********'
/>

{error && <p className='text-red-500'>{error}</p>}


<button
onClick={handleRegister}
disabled={isLoading || !email || !password}
>
{isLoading ? 'Creating account...' : 'Sign up' }

</button>

<p>
  Have an account?
  <Link href='/login' className='hover:underline'>Login</Link>
</p>



</div>



)




}