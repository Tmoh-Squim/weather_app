import mongoose from "mongoose"

export const ConnectDB = async()=>{
    try {
        if(mongoose.connection.readyState === 1){
            return mongoose.connection.asPromise();
        }
        await mongoose.connect("mongodb+srv://squimstech:cKFKDWhdV22OGhgY@cluster0.aoru9.mongodb.net/weather_app")
        .catch((e: any)=>console.log(e))
    } catch (error) {
        console.log(error)
    }
}