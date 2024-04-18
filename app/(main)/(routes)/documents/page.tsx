"use client"
import { Plus, PlusCircle } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useMutation } from 'convex/react';
const page = () => {
  
  const createIdea = useMutation(api.Idea.createIdea)
  
  const tryCreateIdea=()=>{
    const createIdeaPromise = createIdea({title:"Untitled"});

    toast.promise(createIdeaPromise,{
      loading:"Creating your new note...",
      success:"New Note created",
      error:"Error creating note",

    })
  }
  return (
    <div className='flex-1 flex flex-col items-center justify-center'>
        <Image src={"/Tree.png"} width={400} height={400} alt='Empty nest'/>
        <p className='text-lg font-semibold'>Welcome to ideaForest</p>
        <button onClick={()=>{tryCreateIdea()}}  className='bg-baseBlue rounded-lg font-semibold text-white flex items-center  py-2 px-2 gap-2 text-[0.8rem] my-2 hover:scale-105 transition duration-300 hover:shadow-sm'><PlusCircle size={16}/> Add to the Forest</button>
    </div>
  )
}

export default page
