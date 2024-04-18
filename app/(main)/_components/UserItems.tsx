"use client"
import { Avatar } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SignOutButton, useUser } from '@clerk/clerk-react'
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { ChevronsLeftRight } from 'lucide-react'
import React from 'react'

export const UserItems = () => {
    const {user}=useUser()
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <div className='flex  items-center text-sm py-3  w-full hover:bg-slate-500/20 justify-start line-clamp-1 px-1 rounded-md' role='button'>
                <div className='flex items-center  max-w-[100px] whitespace-wrap space-x-2'>
                    <Avatar className='h-5 aspect-square w-5'>
                        <AvatarImage src={user?.imageUrl}>
                        </AvatarImage>
                    </Avatar>
                    <span className='text-start line-clamp-1    font-medium   '>{user?.fullName?.split(" ")[0]}&apos;s Forest </span>
                </div>
                <ChevronsLeftRight className='rotate-90 text-muted-foreground h-4 w-4 ml-auto '/>
            </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-52 p-2 text-muted-foreground space-y-2 font-semibold' align='start'  forceMount>
            <div>
                <p className='text-xs font-medium leading-none '>{user?.emailAddresses[0].emailAddress}</p>
            </div>
            <div className='flex items-center space-x-1'>
           <div className="rounded-md bg-secondary p-1">
           <Avatar className='h-8 aspect-square w-8'>
                        <AvatarImage src={user?.imageUrl}>
                        </AvatarImage>
                    </Avatar>

           </div>
           <span className='text-start line-clamp-1  text-[0.8275rem] text-neutral-500   font-medium '>{user?.fullName?.split(" ")[0]}&apos;s Forest </span>
            </div>
           <DropdownMenuSeparator/>
           <DropdownMenuItem className='w-full text-center text-muted-foreground cursor-pointer flex items-center justify-center' asChild>
           <SignOutButton >Log Out</SignOutButton>
           </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

