import {v} from "convex/values"
import {mutation,query} from "./_generated/server"
import {Doc,Id} from "./_generated/dataModel" 



export const removeIdea = mutation({
    args:{
        id:v.id("Idea")
    },
    handler:async(ctx,args)=>{
        const user = await ctx.auth.getUserIdentity()
        if(!user){
            throw new Error("Not Authenticated!")
        }
        const userId= user.subject
        const Idea = await ctx.db.get(args.id)
        if(!Idea){
            throw new Error("Not Found!")
        }
        const disacrdedIdea= await ctx.db.delete(args.id)
        return disacrdedIdea
    }
})
export const restoreIdea =mutation({
    args:{
        id:v.id("Idea")
    },
    handler:async(ctx,args)=>{
        const user = await ctx.auth.getUserIdentity()
        if(!user){
            throw new Error("Not Authenticated!")
        }
        const userId= user.subject
        const Idea=await ctx.db.get(args.id)
        if(!Idea){
            throw new Error("Not found")
        }
        if(userId !== Idea.userId){
            throw new Error("Unauthorized!")
        }
        const options:Partial<Doc<"Idea">>={
            isArchived:false
        }
        if(Idea.parentIdea){
            const parent=await ctx.db.get(Idea.parentIdea)
            if(parent?.isArchived){
                options.parentIdea=undefined
            }
        }
       
        const recursiveRestore=async(ideaId:Id<"Idea">)=>{
            const children = await ctx.db.query("Idea").withIndex("by_idea_parent", (q)=>
                q.eq("userId",userId)
                .eq("parentIdea",ideaId)
            ).collect()

            for(const child of children){
                await ctx.db.patch(child._id,{
                    isArchived:false
                })
                await recursiveRestore(child._id)
            }
        }

        const document = await ctx.db.patch(args.id,options)
        recursiveRestore(args.id)
        return document
    }
})
type taggedIdea={
    idea:Doc<"Idea">,
    tags:Doc<"Tag">[]
}
export const getTrash=query({
    handler:async(ctx,args)=>{
        const user = await ctx.auth.getUserIdentity()
        if(!user){
            throw new Error("Not Authenticated!")
        }
        const userId= user.subject
        const ideas=await ctx.db.query("Idea").withIndex("by_user",(q)=>
        q.eq("userId",userId)
        ).filter((q)=>
        q.eq(q.field("isArchived"),true)
        ).collect()
        let taggedIdeas:taggedIdea[]=[]
       await Promise.all(ideas.map(async(idea)=>{
        const tags = await ctx.db.query("Tag").withIndex("by_user_idea",(q)=>
        q.eq("userId",userId)
        .eq("parent",idea._id)
        ).collect()
        taggedIdeas.push({idea,tags})
        console.log({idea,tags})
    })) 
        return taggedIdeas
    }
})
export const archive =mutation({
    args:{
        id:v.id("Idea")
    },
    handler:async(ctx,args)=>{
        const user = await ctx.auth.getUserIdentity()
        if(!user){
            throw new Error("Not Authenticated!")
        }
        const userId= user.subject
        const Idea=await ctx.db.get(args.id)
        if(!Idea){
            throw new Error("Not found")
        }
        if(userId !== Idea.userId){
            throw new Error("Unauthorized!")
        }

        const recursiveArchive=async(ideaId:Id<"Idea">)=>{
            const children = await ctx.db.query("Idea").withIndex("by_idea_parent", (q)=>
                q.eq("userId",userId)
                .eq("parentIdea",ideaId)
            ).collect()

            for(const child of children){
                await ctx.db.patch(child._id,{
                    isArchived:true
                })
                await recursiveArchive(child._id)
            }
        }

        const document = await ctx.db.patch(args.id,{
            isArchived:true
        })
        recursiveArchive(args.id)
        return document
    }
})
export const createChildIdea=mutation({
    args:{
        parentIdea:v.optional(v.id("Idea")),
        tags:v.optional(v.id("Tag")),

    },
    handler:async(ctx,args)=>{
        const user = await ctx.auth.getUserIdentity()
        if(!user){
            throw new Error("Not Authenticated!")
        }
        const userId= user.subject
        const idea=ctx.db.insert("Idea",{
            title:"Untitled",
            parentIdea:args.parentIdea,
            content:"",
            isArchived:false,
            isPublished:false,
            userId
        })
        return idea
    }
})
export const getSidebarDocuments=query({
    args:{
        parentIdea:v.optional(v.id("Idea"))
    },handler:async(ctx,args)=>{
        try{
            const identity= await ctx.auth.getUserIdentity();
            const userId = identity?.subject
            const ideas= ctx.db.query("Idea").withIndex("by_idea_parent",(q)=>
            q.eq("userId",userId!)
            .eq("parentIdea",args.parentIdea)
            ).filter((q)=>q.eq(q.field("isArchived"),false))
            .order("desc")
            .collect()
            if(!userId){
                throw new Error("Not Authenticated!")
            }
            console.log(ideas)
            return ideas
        }
        catch(error){
            console.log(error)
            return []
        }
    }
})
export const getIdeas = query({
    handler: async (ctx, args) => {
        try {
            const identity = await ctx.auth.getUserIdentity();
            console.log(identity);

            // Now you can proceed with your logic here
            // For example, querying for ideas
            const ideas = await ctx.db.query("Idea").collect();

            // Check if identity is null and throw error if so
            if (!identity) {
                throw new Error('Not Authorized!');
            }
            console.log(ideas)
            return ideas;
        } catch (error) {
            // Handle errors appropriately
            console.error(error);
            return [];
        }
    }
});
export const createIdea =mutation({
    args:{
        title:v.string(),
        parentIdea:v.optional(v.id("Idea")),
        tags:v.optional(v.id("Tag")),
        content:v.optional(v.string())
    },
    handler:async(ctx, args)=> {
        const user = await ctx.auth.getUserIdentity()
        if(!user){
            throw new Error("Not Authenticated!")
        }
        const userId= user.subject
        const idea = await ctx.db.insert("Idea",{
            title:args.title,
            content:args.content,
            isArchived:false,
            isPublished:false,
            userId
        })
        return idea
    },
})