import { validEmailRegex } from "@/app/types/types";
import { ConnectDB } from "@/server/config/Db";
import Users from "@/server/models/users";
import { NextResponse } from "next/server";

export async function POST(req:Request){
    try {
        const {email,weather,lat,lon} = await req.json();

        if(!email){
            return NextResponse.json({
                success:false,
                message:"Email is required"
            })
        }
        if(!email.match(validEmailRegex)){
            return NextResponse.json({
                success:false,
                message:"Invalid email address"
            })  
        }
        if(!weather){
            return NextResponse.json({
                success:false,
                message:"Weather is required"
            })
        }
        await ConnectDB();
        const existingEmail = await Users.findOne({email});
        if(existingEmail){
            return NextResponse.json({
                success:false,
                message:"You have already subscribed to get notifications"
            })
        }
        const newUser = {
            email:email,
            lat:lat,
            lon:lon,
            weather:weather
        }
        await Users.create(newUser);
        return NextResponse.json({
            success:true,
            message:`You have successfully subscribed to get weathear notification during ${weather} forecast`
        })
    } catch (error) {
        console.log('first',error)
        return NextResponse.json({
            success:false,
            message:"Internal server error"
        })
    }
}