import mongoose, { models } from "mongoose";

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },
    weather:{
        type:String,
        required:true
    },
    lat:{
        type:String
    },
    lon:{
        type:String
    }
},{timestamps:true})

const Users = models.Users || mongoose.model("Users",UserSchema)
export default Users