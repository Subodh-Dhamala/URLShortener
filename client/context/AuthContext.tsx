'use client';

import {createContext, useContext, useEffect, useState} from 'react';

interface AuthContextType {
  token: string | null;
  email: string | null;
  login: (token: string, email: string, username:string) => void;
  logout: ()=> void;
  username:string |null;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}){
  const [token,setToken] = useState<string|null>(null);
  const [email,setEmail] = useState<string|null>(null);
  const [username,setUsername] = useState<string|null>(null);

  useEffect(()=>{
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    const username = localStorage.getItem('username');

    if(token) setToken(token);
    if(email) setEmail(email);
    if(username) setUsername(username);

  },[]);

  const login = (token:string, email: string, username:string)=>{
    localStorage.setItem('token',token);
    localStorage.setItem('email',email);
    localStorage.setItem('username',username);
    setToken(token);
    setEmail(email);
    setUsername(username);
  };

  const logout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null);
    setEmail(null);
    setUsername(null);
  }

  return(

    <AuthContext.Provider value = {{
      token,
      email, 
      login,
      logout,
      username,
      isLoggedIn: !!token,
    }}
    >
      {children}

    </AuthContext.Provider>

  );

}


export function useAuth(){
  const context = useContext(AuthContext);

  if(!context){
    throw new Error('useAUth must be inside AuthProvider');
  }

  return context;

}