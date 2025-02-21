import { ConnectDB } from "@/server/config/Db";
import Users from "@/server/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {

        const email = req.nextUrl.pathname.split("/").pop(); 
        if (!email) {
            return NextResponse.json({
                success: false,
                message: "Email parameter is required."
            }, { status: 400 });
        }

        await ConnectDB();
        const user = await Users.findOneAndDelete({ email });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Email not found in our subscription list."
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "You have successfully unsubscribed from weather notifications."
        });

    } catch (error) {
        console.error("Unsubscribe Error:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong."
        }, { status: 500 });
    }
}
