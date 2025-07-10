import {z} from 'zod'

export const usernameValidation = z
   .string()
   .min(2,"username must be atleast 2 characters")
   .max(8,"username must be more than 8 characters")
   .regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")

export const singUpSchema =z.object({

     username:usernameValidation,
     email:z.string().email({message:'invalid email address'}),
     password:z.string().min(6,{message:"password must be at least 6 characters"})
   })