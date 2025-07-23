import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request){
    await dbConnect()
   
    try{
        const {searchParams } =new URL(request.url)
        const queryParam ={
            username:searchParams.get('username')
        }
        //validation with zod
       const result= UsernameQuerySchema.safeParse(queryParam)
       console.log(result)//remove
       if(!result.success){
        const usernameErrors = result.error.format().username?._errors || []
        return Response.json({
            sucess:false,
            message:usernameErrors?.length>0? usernameErrors.join(','):'Invalid query parameters',
        },{status:400})
       }

      const {username} =result.data

      const existingVerifiedUser= await UserModel.findOne ({username,isverified:true})
      if(existingVerifiedUser){
        return Response.json({
              sucess:false,
              message:'username is already taken'
        },{status:400})
      }
        
        return Response.json({
              sucess:true,
              message:'username is avalable'
        },{status:400})

    } catch (error){
        console.error("Error checking username", error)
        return Response.json(
         {
            success:false,
            message:"Error checking username"
         },
         {status : 500}   
        )
    }
}
