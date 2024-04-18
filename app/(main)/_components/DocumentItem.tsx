"use client";
import { api } from '@/convex/_generated/api';
import {  Doc, Id } from '@/convex/_generated/dataModel'
import { Item } from '@radix-ui/react-dropdown-menu';
import { useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { SidebarItem } from './SidebarItem';
import { cn } from '@/lib/utils';
import { File } from 'lucide-react';
interface documentListProps{
    id?:Id<"Idea">,
    data?:Doc<"Idea">[]
    level?:number,
   
}
export const DocumentList = ({id,data,level}:documentListProps) => {
    const router =useRouter()
    // const {id}=useParams()
    console.log({id,level})
    const [expanded,setExpanded]=useState<Record<string,boolean>>({})
    const params = useParams();
    const onExpand=(docId:Id<"Idea">)=>{
        console.log({docId,expanded})
        setExpanded((state)=>({
            ...state,
            [docId]:!state[docId]
        }))
    }
    const documents=useQuery(api.Idea.getSidebarDocuments,{
        parentIdea:id
    })
    const routeToDocument=(id:Id<"Idea">)=>{
        router.push(`/documents/${id}`)
    }
    if(documents===undefined)
    {
        return <>
        <SidebarItem.Skeleton level={level}/>
        {
            level===0 && ( <>
                <SidebarItem.Skeleton level={level}/>
                <SidebarItem.Skeleton level={level}/>
            </>
            )
        }
        </>
    }
  return (
    <div style={{
        paddingLeft: level ? `${level + 5}px` : undefined
      }}>
       {
        id &&  <p  className={cn("hidden text-[0.7rem] text-center w-full  font-medium text-muted-foreground/60 ",expanded && "last:block",level === 0 && "hidden",)} >No Ideas Inside</p>
       }
        {
            documents.map((document)=>(
                <SidebarItem isExpandable id={document._id}  title={document.title} active={params.id === document._id }  expanded={expanded[document._id]} onExpanded={()=>{onExpand(document._id)}} Icon={File} iconProps={{size:13}} className='min-h-8 rounded-lg my-1.5'  documentIcon={document.icon} level={level?level+1:0} onClick={()=>{routeToDocument(document._id)}}>
                    {
                        expanded[document._id] && <DocumentList  id={document._id} level={level!+1||1} />
                    }


                </SidebarItem>
            ))
        }
    </div>
  )
}
