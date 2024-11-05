import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    item:{
    type:String,
    required:true   
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    },{timestamps:true})

export const Item = mongoose.model("Item",itemSchema);