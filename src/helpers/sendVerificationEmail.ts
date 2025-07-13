import { resend } from "@/lib/resend";

import VerificationEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";
import { success } from "zod";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
): Promise<ApiResponse> {
try {
    await resend.emails.send({
        from:'sa@ks.com',
        to:email,
        subject:'mystery message verifaction code',
        react:VerificationEmail({ username,otp:verifyCode}),
    });
    return { success:true,message: 'Verification Email sent successfully.'}
}catch(emailError){
    console.error('error sending verifaction email:', emailError);
    return{success:false,message:'failed to send verifaction email.'};
}
}