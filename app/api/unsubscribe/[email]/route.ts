import { ConnectDB } from "@/server/config/Db";
import Users from "@/server/models/users";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(req:NextRequest,{params}: { params: { email: string } }){
    try {
        const {email} = params;
         await ConnectDB();
        const user = await Users.findOneAndDelete({email:email});
         if (!user) {
            return NextResponse.json({
                success: false,
                message: "Email not found in our subscription list."
            });
        }
         return NextResponse.json({
            success:true,
            message:"You have successfully unsubscribe from getting weather notifications"
         })
    } catch (error) {
        return NextResponse.json({
            success:false,
            message:"Something went wrong"
        })
    }
}