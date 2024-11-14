import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    lastLogin:{
        type:Date,
        default:Date.now
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    verificationToken:String,
    verificationTokenExpiresAt:Date,
    friends:[{type: String}],
    role:{
        type: String,
        enum:['user', 'admin'],
        default:'user'
    }

    },{timestamps:true})

const User = mongoose.model("User",userSchema);
export default User;
