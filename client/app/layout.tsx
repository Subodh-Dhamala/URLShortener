import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';


const geist = Geist({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'SanoLink',
  description: 'Shorten your URLs',
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return(

    <html>
      <body className='{geist.className} flex flex-col '>
        
        <AuthProvider>
          <Navbar/>
          {children}
        </AuthProvider>
       <Footer/>
      </body>
    </html>




  )
}