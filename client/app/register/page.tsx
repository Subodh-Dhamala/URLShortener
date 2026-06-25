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

<div className='min-h-screen flex justify-center items-center bg-gray-50 px-4'>
  
<div className='w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6  '>

  <h1 className=' text-2xl font-bold text-gray-700 text-center'>Register</h1>
 
 <div className='flex flex-col space-y-6'>

 <input 
  type="email"
  value={email}
  required
  onChange={(e)=>setEmail(e.target.value)}
  placeholder='Enter your email'
  className='w-full p-4 rounded-lg border border-gray-300
   focus:outline-blue-600 '
  />

  <input 
  type="password"
  value={password}
  required
  className='w-full p-4 rounded-lg border border-gray-300
   focus:outline-blue-600 '
  onChange={(e)=>setPassword(e.target.value)}
  onKeyDown={(e)=>e.key === 'Enter' && handleRegister()}
  placeholder='***********'
/>

 {error && (
        <p className="text-sm text-red-500 text-center">
          {error}
        </p>
      )}


<button
onClick={handleRegister}
disabled={isLoading || !email || !password}
className='bg-blue-600 text-white p-4 rounded lg
disabled:opacity-50 disabled:cursor-not-allowed'
>
{isLoading ? 'Creating account...' : 'Sign up' }
</button>

<p className='text-center'>
  Have an account? {' '}
  <Link 
  href='/login' 
  className='hover:underline'
  >Login</Link>
</p>

 </div>


  </div>

</div>



)




}