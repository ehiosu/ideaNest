import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/clerk-react';
import { useMutation, useQuery } from 'convex/react';
import { ChevronDown, ChevronUp, Ellipsis, LucideIcon, Menu, Plus, Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { ReactNode } from 'react'
import { toast } from 'sonner';

type sidebarProps={
    id?:Id<"Idea">,
    documentIcon?:string,
    active?:boolean,
    expanded?:boolean,
    isSearch?:boolean,
    level?:number,
    title?:string,
    onExpanded?:()=>void,
    isExpandable?:boolean;
    onClick?:(e:React.MouseEvent<HTMLDivElement>)=>void,
    className?:string,
    Icon:LucideIcon,
    iconProps?:{},
    isMobile?:boolean,
    children?:ReactNode
}
export const SidebarItem = ({id,isExpandable,documentIcon,active,expanded,isSearch,level,onExpanded,title,onClick,className,Icon,iconProps,isMobile,children}:sidebarProps) => {
    const ExpansionIcon:LucideIcon | null=isExpandable? !expanded?ChevronDown:ChevronUp:null

    const createChildIdea=useMutation(api.Idea.createChildIdea)
    const archiveIdea=useMutation(api.Idea.archive)

    const router =useRouter()
    const user=useUser()
    const params=useParams()

  const tryExpand=(e:React.MouseEvent<HTMLDivElement>)=>{
    e.stopPropagation()
    console.log(expanded)
    if(onExpanded){
      onExpanded()
    }
  }
  const tryCreateChildIdea=(id:Id<"Idea">)=>{
    const createChildIdeaPromise=createChildIdea({parentIdea:id}).then((ideaId)=>{
      if(!expanded){
        onExpanded?.()
      }
      router.push(`/documents/${ideaId}`)
    })
    toast.promise(createChildIdeaPromise,{
      loading:"Creating Your Idea...",
      success:"Page Successfully create!",
      error:"Error Creating Idea, Try again in a few minutes."
    })
  }
  
  const tryArchiveIdea=(id:Id<"Idea">,name:string)=>{
    if(!id) return
    const archiveIdeaPromise=archiveIdea({id}).then(()=>{
      if(params.id === id){
        router.push('/documents')
      }
    })

    toast.promise(archiveIdeaPromise,{
      loading:`Trying to delete idea ${name}`,
      success:`Idea: ${name} has been Deleted.`,
      error:`Error deleting idea: ${name}`
    })
  }
  return (
  <>
      <div role='button' onClick={onClick}  style={{
       paddingLeft: level ? `${level + 5}px`:'5px'
    }}  className={cn(` min-h-8 group text-[0.7rem] py-1  hover:bg-primary/5 flex gap-1 items-center text-muted-foreground font-medium`,active && "bg-primary/5 text-primary",className)}>
       {
        isExpandable && ExpansionIcon && !!id&& <div onClick={tryExpand}>
           <ExpansionIcon  className=' h-4 w-4 shrink-0 text-muted-foreground/50"' />
        </div>
      }
       {
        documentIcon?documentIcon: <Icon   className="shrink-0 h-[11px] w-[11px]  text-muted-foreground"  />
       }
       <span className='truncate'> {title}</span>
      
     
       {
        isSearch &&<kbd className={cn('whitespace-nowrap text-xs pointer events-none inline-flex h-4 select-none items-center rounded border bg-muted px-1.5 font-mono text-[7px] text-muted-foreground',isMobile && "opacity-100")}>
          <span>CTRL</span>K

        </kbd>
      }
    {

      !!id && (
        <div className='ml-auto flex items-center mr-1 space-x-1'>
          <DropdownMenu>
            <DropdownMenuTrigger onClick={(e)=>{e.stopPropagation()}} className='hover:bg-slate-300/40 rounded-sm data-[state=open]:bg-slate-400/30'>
              <Ellipsis className='h-5 w-5 hover:bg-primary/10 rounded-sm p-1 text-muted-foreground'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='p-2' side='right'>
              <DropdownMenuItem onClick={(e)=>{
                e.stopPropagation()
                tryArchiveIdea(id,title!)
              }} className='text-[0.7rem]'>
                <Trash className='w-4 h-4 shrink mr-2'/>
                Delete
              </DropdownMenuItem>
             <DropdownMenuSeparator/>
             <div className='text-xs text-neutral-400 my-2'>
              <p>Last edited by: {user.user?.fullName!}</p>
             </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div role='button' onClick={(e)=>{
            e.stopPropagation()
            tryCreateChildIdea(id)
          }} className='group-hover:opacity-100 opacity-0 transition h-full ml-auto '>
            <Plus className='h-5 w-5 hover:bg-primary/10 rounded-sm p-1 text-muted-foreground'/>
          </div>
        </div>
      )
    }
    </div>
  {children}
  </>
  )
}

SidebarItem.Skeleton=({level}:{level?:number})=>{
 
  return(
    <div  className='flex items-center space-x-2 py-1'  style={{
      paddingLeft: level ? `${level + 5}px`:'5px'
    }}>
        <Skeleton className='h-4 w-4'/>
        <Skeleton className='h-4 w-[40%]'/>
    </div>
  )
}
