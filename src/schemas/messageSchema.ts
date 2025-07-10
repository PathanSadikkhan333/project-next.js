import { z } from "zod"

export const messageSchema=z.object({
     content:z
     .string()
     .min(10,{message:'contect must be at least of 10 characters'})
     .max(300,{message:'contect must be no longer than 300 characters'})
     
})