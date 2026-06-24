'use client';

import {createContext, useContext, useEffect, useState} from 'react';

interface AuthContextType {
  token: string | null;
  email: string | null;
  login: (token: string, email: string) => void;
  logout: ()=> void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}){
  const [token,setToken] = useState<string|null>(null);
  const [email,setEmail] = useState<string|null>(null);

  useEffect(()=>{
    const t = localStorage.getItem('token');
    const e = localStorage.getItem('email');

    if(t) setToken(t);
    if(e) setToken(e);

  },[]);

  const login = (token:string, email: string)=>{
    localStorage.setItem('token',token);
    localStorage.setItem('email',email);
    setToken(token);
    setEmail(email);
  };

  const logout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    setToken(null);
    setToken(null);
  }

  return(

    <AuthContext.Provider value = {{

      token,
      email, 
      login,
      logout,
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