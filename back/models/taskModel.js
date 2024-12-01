import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.ObjectId,
             ref: "User",
             required: true
            },

        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            // required: false
            default: "", // שדה אופציונלי

        },
        dueDate: {
            type: Date,
            // required: false
            default: null,

        },
        status: {
            type: String,
            enum: ['Open', 'In Progress', 'Completed' ],
            default: 'Open'
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // הפניה לטבלת המשתמשים
            // required: false,
            default: null
        },
        taskGroupId: {
            type: mongoose.Schema.Types.ObjectId, 
            required: true } 


    },
    { timestamps: true }
)

export default mongoose.model("Task", taskSchema);
