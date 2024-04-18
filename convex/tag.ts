import {v} from "convex/values"
import {mutation,query} from "./_generated/server"

export const createTag=mutation({
    args:{
        name:v.string()
    },handler:async(ctx,args)=>{
        const user=await ctx.auth.getUserIdentity()
        if(!user){
            throw new Error("Not Authenticated!")
        }
        const tag= await ctx.db.insert("Tag",{
            name:args.name,
            userId:user.subject
        })
        return tag
    }
})