import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
             ref: "users",
             required: true
            },

        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: false
        },
        dueDate: {
            type: Date,
            required: false
        },
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Completed' ],
            default: 'Open'
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // הפניה לטבלת המשתמשים
            required: false,
        },
        taskGroupId: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true } 


    },
    { timestamps: true }
)

export default mongoose.model("Task", taskSchema);
