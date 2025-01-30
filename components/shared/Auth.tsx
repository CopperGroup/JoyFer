'use client'
import Link from "next/link"
import { Button } from "../ui/button"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useState } from "react"
import AdminLink from "./AdminLink"
import Image from "next/image"
import { LogOut, User } from "lucide-react"


const Auth = ({ email, user }: { email: string, user: string}) => {
  const { data:session, status} = useSession();
  const [burger, setBurger] = useState('burger-lines');
  const [bgBurger, setBgBurger] = useState('bg-burger');
  user = JSON.parse(user);

  
    const handleRouteChange= () =>{
      setBurger('burger-lines');
      setBgBurger('bg-burger')
      document.body.style.overflow = 'auto';
    }
  function burgerClass(){
    if(burger === 'burger-lines'){
      setBurger('burger-lines burger-button');
      setBgBurger('bg-burger bg-burger-active')
      document.body.style.overflow = 'hidden';
    }else{
      setBurger('burger-lines');
      setBgBurger('bg-burger')
      document.body.style.overflow = 'auto';
    }
  }
  return (
    <>
      
      {//@ts-ignore 
        status === "authenticated" ? (<Button onClick={signOut} className="h-8 space-x-1 bg-red-600 text-[14px] font-semibold text-white rounded-none mt-[6px] px-5 transition-colors duration-300 hover:bg-red-500" size="sm"><LogOut className="w-4 h-4"/><p>Вийти</p></Button>)
        : (<Link href='/login'>
            <Button className="appearance-none h-8 space-x-1 text-[14px] font-semibold rounded-none mt-[6px] px-5 transition-colors duration-300 hover:bg-white hover:text-black" size="sm"><User className="w-4 h-4"/><p>Увійти</p></Button>
          </Link>
          )}
    </>
  )
}

export default Auth