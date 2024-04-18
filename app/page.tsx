"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";

import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col ">
        <Nav/>
        <Hero/>
    </main>
  );
}

const Nav=()=>{
  const {isAuthenticated,isLoading}=useConvexAuth()
 
  return (
    <div className="w-full px-16 flex items-center py-4">
        <div className="flex items-center space-x-2">
          <p className="font-semibold">Idea Nest</p>
        </div>
        <div className="ml-auto flex flex-row space-x-10 text-lightGrey sm:hidden md:flex  items-center">
          <p>Home</p>
          <p>About Us</p>
          <p>Features</p>
          <p>Reviews</p>
         {
          isAuthenticated&& !isLoading ?<>
          <button className="bg-baseBlue text-white px-6 py-2 rounded-sm" ><Link href={"/documents"}>Go to your Idea Nest</Link></button>
          <UserButton afterSignOutUrl="/"/>
          
          
          </> :!isLoading && 
           <SignInButton mode="modal">
            <button className="bg-baseBlue text-white px-6 py-2 rounded-sm">Get Started</button>
           </SignInButton>
         }
        </div>
      </div>
  )
}

const Hero=()=>{
  return(
   <section className="w-full flex items-center p-4">
     <div className="flex flex-col w-[40%] pl-20 justify-center  pr-12">
     <div className="flex flex-col  text-[4rem] font-semibold leading-[1] w-1/2">
        <p className="">Organize</p>  <p>Your</p> <p>Ideas</p>
      </div>
      <p className="text-lightGrey my-3 ">With IdeaNest, manage your thoughts and collaborate with your team seamlessly on one platform</p>
    <SignedOut>
    <SignInButton mode="modal">
     <button className="w-max bg-baseBlue px-6 py-3 rounded-sm text-white ">Start Organizing</button>
     </SignInButton>
    </SignedOut>
    <SignedIn>
      <button className="w-max bg-baseBlue px-6 py-3 rounded-sm text-white ">
          <Link href="/documents">Go to your Idea Nest</Link>
      </button>
    </SignedIn>
     
     </div>

     <img className="h-[70vh]  w-[60%]"/>
   </section>
  )
}