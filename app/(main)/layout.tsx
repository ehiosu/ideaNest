"use client";
import { useConvexAuth } from 'convex/react';
import { redirect } from 'next/navigation';
import React from 'react'
import { Sidebar } from './_components/Sidebar';

 const layout = ({children}:{children:React.ReactNode}) => {
const {isAuthenticated,isLoading}=useConvexAuth()
if(!isAuthenticated && !isLoading) return redirect("/")
  return (
    <main className='min-h-screen w-full flex space-x-2 p-2  h-screen pl-0'>
        <Sidebar/>
        {children}
        </main>
  )
}

export default layout