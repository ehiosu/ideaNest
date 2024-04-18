import {defineSchema,defineTable} from "convex/server"
import {v} from "convex/values"

export default defineSchema({
    Idea:defineTable({
        title:v.string(),
        userId:v.string(),
        isArchived:v.boolean(),
        parentIdea:v.optional(v.id("Idea")),
        content:v.optional(v.string()),
        isPublished:v.boolean(),
        icon:v.optional(v.string())
        
    }).index("by_user",["userId"])
    .index("by_idea_parent",["userId","parentIdea"])
    ,
    Tag:defineTable({
        name:v.string(),
        parent:v.id("Idea"),
        userId:v.string(),        
    }).index("by_user",["userId"])
    .index("by_user_idea",["userId","parent"])
})