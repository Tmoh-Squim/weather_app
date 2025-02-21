import { ConnectDB } from "@/server/config/Db";
import Users from "@/server/models/users";
import sendMail from "@/server/utils/SendEmailNotification";
import { NextResponse } from "next/server";


export async function GET() {
    try {
        await ConnectDB();
        const users = await Users.find();
        if (!users.length) {
            return NextResponse.json({
                success: false,
                message: "No subscribed users found."
            });
        }
        for (const user of users) {
            const { lat, lon, weather, email } = user;
            const response = await fetch(
                `${process.env.FORECAST_API_URL}?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`
            );
            const data = await response.json();

            const matchedForecast = data.list.find((forecast: { weather: { main: string; description: string }[]; dt_txt: string }) =>
                forecast.weather[0].main.toLowerCase() === weather.toLowerCase()
            );

            if (matchedForecast) {
                const { description } = matchedForecast.weather[0];
                const forecastTimeUTC = matchedForecast.dt_txt;
                const forecastDate = new Date(forecastTimeUTC + " UTC");

                // Get the user's timezone based on lat/lon using Intl.DateTimeFormat().resolvedOptions().timeZone
                const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; 
    
                // Format the time in the user's local timezone
                const localTime = new Intl.DateTimeFormat("en-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                    timeZone: userTimeZone
                }).format(forecastDate);
    

                await sendMail({
                    email: email,
                    subject: "Weather Notification Alert",
                    message: `Hello, \n\nThis is to inform you that the weather forecast predicts ${description} (${weather}) on ${localTime} at your location.\n\nStay prepared! \n\nBest Regards,\nYour Weather Alert Team`
                });
            }
        }
        return NextResponse.json({
            success: true,
            message: "Notifications processed successfully."
        });
    } catch (error) {
        console.log('first', error)
        return NextResponse.json({
            success: false,
            message: "Internal server error"
        });
    }
}