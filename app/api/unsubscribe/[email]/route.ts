import { ConnectDB } from "@/server/config/Db";
import Users from "@/server/models/users";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { email: string } }) {
    try {
        const { email } = params; 

        if (!email) {
            return NextResponse.json({
                success: false,
                message: "Email is required to unsubscribe."
            });
        }

        await ConnectDB();
        const user = await Users.findOneAndDelete({ email });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Email not found in our subscription list."
            });
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
        });
    }
}
