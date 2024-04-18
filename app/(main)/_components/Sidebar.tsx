import { cn } from "@/lib/utils";
import { ChevronLeft, File, MenuIcon, PlusCircle, Search, Settings, Trash } from "lucide-react";
import { usePathname } from "next/navigation";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItems } from "./UserItems";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import {  useAuth } from "@clerk/clerk-react";
// import { Item } from "@radix-ui/react-dropdown-menu";
import { SidebarItem } from "./SidebarItem";
import { toast } from "sonner";
import { DocumentList } from "./DocumentItem";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Trashbox } from "./Trashbox";

export const Sidebar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isResizing = useRef(false);
  const sideBarRef = useRef<ElementRef<"aside">>(null);
  const navBarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(()=>isMobile);
  const pathName=usePathname()
  const {userId}=useAuth()


 

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };
  const handleMouseMove = (
    e: MouseEvent
  ) => {
    if(!isResizing.current)return ;
    let newWidth=e.clientX
    if(newWidth<120)newWidth=120
    if(newWidth>480) newWidth=480

    if (sideBarRef.current && navBarRef.current){
        sideBarRef.current.style.width= `${newWidth}px`
        navBarRef.current.style.setProperty("left",
            `${newWidth}px`)
        navBarRef.current.style.width=`calc(100%-${newWidth}px)`
    }
  };
  const handleMouseUp = (e: MouseEvent) => {
    isResizing.current=false
    document.removeEventListener("mousemove",handleMouseMove)
    document.removeEventListener("mouseup",handleMouseUp)
  };
  const resetSidebar=()=>{
    if(sideBarRef.current && navBarRef.current){
        setIsCollapsed(false)
        setIsResetting(true)
        sideBarRef.current.style.width=isMobile?"100%":"124px"
        navBarRef.current.style.setProperty("width",isMobile?"0":"calc(100%-124px)")
        navBarRef.current.style.setProperty("left",isMobile?"0":"124px")

        setTimeout(()=>{
            setIsResetting(false)
        },550)
    }
  }

  useEffect(()=>{
    if(isMobile){
        toggleSidebar(false)
    }
    else{
      resetSidebar()
    }
  },[isMobile,pathName])
  const toggleSidebar=(hidden=false)=>{
    
    if(sideBarRef.current && navBarRef.current){
        
        if(!hidden){
         setIsCollapsed(true)
        setIsResetting(true)
        sideBarRef.current.style.width="0"
        navBarRef.current.style.setProperty("width","99%")
        navBarRef.current.style.setProperty("left","0px")
        }
        else{
            setIsCollapsed(false)
            setIsResetting(true)
            const screenWidth= window.innerWidth
            const targetWidth=screenWidth-sideBarRef.current.clientWidth-160
            sideBarRef.current.style.width=isMobile?"100%":"124px"
            navBarRef.current.style.setProperty("width",isMobile?"0":targetWidth.toString()+"px")
            navBarRef.current.style.setProperty("left",isMobile?"0":"124px")
            // w-[calc(100%-124px)]
        }
        setTimeout(()=>{
            setIsResetting(false)
        },550)
        
    }
    
  }

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
    <>
      <aside
        className={cn(
            
          isMobile && " absolute p-2",
          isResetting && "transition-all ease-in-out duration-500",
         !isCollapsed && "w-32  p-2",
         isCollapsed && "w-0 p-0",
         !isMobile && "relative",
          "group/sidebar rounded-r-md  z-[9999] overflow-y-auto h-full text-[0.8275rem] flex flex-col bg-secondary "
        )}
        ref={sideBarRef}
      >
        <div
          onMouseDown={handleMouseDown}
          onClick={()=>{resetSidebar()}}
          className="transition-opacity opacity-0 group-hover/sidebar:opacity-100 absolute cursor-ew-resize h-full w-1 bg-primary/10 top-0 right-0 "
        />
        <div
          role="button"
          className={cn(
            "absolute top-2 right-2 w-6 aspect-square opacity-0 group-hover/sidebar:opacity-100 rounded-sm hover:bg-neutral-300 transition-opacity grid place-items-center",
            isMobile && "opacity-100"
          )}
         onClick={()=>{toggleSidebar(false)}}
        >
          <ChevronLeft className="text-[0.5rem]" size={18} />
        </div>
        <UserItems/>
        <SidebarItem title="Search" Icon={Search} className="rounded-lg   px-1 min-h-max py-2 w-full" isSearch iconProps={{size:13}}/>
        <SidebarItem isMobile={isMobile} title="New Idea"   Icon={PlusCircle} onClick={(e)=>{tryCreateIdea()}} iconProps={{className:"text-xs",size:13}} className="space-x-1 min-h-8  rounded-md cursor-pointer hover:font-semibold transition my-2 w-full"/>
        <SidebarItem title="Settings" Icon={Settings} className="rounded-lg   px-1 min-h-max py-2 w-full"  iconProps={{size:13}}/>

        <div className="">
         <DocumentList level={0}/>
          <Popover>
            <PopoverTrigger className="w-full ">
              <SidebarItem title="Trash" Icon={Trash} level={0} className="w-full rounded-md my-1"/>
            </PopoverTrigger>
            <PopoverContent className="" side={isMobile?"bottom":"right"}>
              <Trashbox/>
            </PopoverContent>
          </Popover>
        </div>
      </aside>
      <div
        ref={navBarRef}
        className={cn(
          "absolute top-0 z-[99999] left-[124px] ",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full"
        )}
      >
        <nav className=" px-3 py-2 w-full">
          {isCollapsed && (
            <MenuIcon
            onClick={()=>{toggleSidebar(true)}}

            className="h-6 w-6 text-muted-foreground "
              role="button"
            />
          )}
        </nav>
      </div>
    </>
  );
};
