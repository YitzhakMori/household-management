import User from "../models/user.model.js";
import Task from '../models/taskModel.js'
import mongoose from "mongoose";

export const addTask = async (req, res) => {
    try {
        const {title, description, dueDate, status, assignee} = req.body;

        const taskGroupId = new mongoose.Types.ObjectId();

        if (!title ){
            return res.status(400).json({error: "שדה הכותרת הוא חובה"});
        }
        const userId = req.user.id;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "User authentication failed" });
        }
        
        
        const newTask = await Task.create({
            title,
            description,
            dueDate,
            status,
            assignee,
            taskGroupId,
            userId
        });
        const friendEmails = req.user.friends; // אימיילים של חברים
        if (!friendEmails || friendEmails.length === 0) {
            return res.status(201).json(newTask); // אם אין חברים, מחזירים רק את המשימה שנוצרה
        }
        const friends = await User.find({ email: {$in: friendEmails}})
        const tasksToAdd = friends.map(friend => ({
            title,
            description,
            dueDate,
            status,
            assignee,
            taskGroupId,
            userId: friend._id
        }));
        if (tasksToAdd.length > 0) {
            await Task.insertMany(tasksToAdd); // הוספת המשימות עבור החברים
        };
        res.status(201).json(newTask);
    }catch (error) {
        return res.status(500).json({ error: error.message || "שגיאה ביצירת משימה" });
    }
    
}

export const getAllTasks = async (req, res) => {
    try {
        const userId = req.user.id;   
        console.log("userId: " + userId);
        const tasks = await Task.find({userId});
        console.log("tasks: " , tasks);
        res.json(tasks);
    }catch (error) {
        res.status(500).json({error: error.massage || "Failed to get tasks"})
    }
}

export const updateTask = async  (req, res) => {
    const  {taskId} = req.params
    const {title, description, dueDate, status, assignee} = req.body;
    const userId = req.user.id
    console.log("🚀 ~ updateTask ~ userId:", userId)
    console.log("taskId: " + taskId)
     console.log("title: " + title)
     
    try{
        const task = await Task.findOne({_id: taskId, userId: userId});
        console.log("🚀 ~ updateTask ~ task:", task)
        
        if (!task){
            return res.status(404).json({message: "Task not found"})
        }
        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.status = status || task.status;
        task.assignee = assignee || task.assignee;
        
        await task.save();
        
        const {taskGroupId} = task;

        const user = await User.findById(userId);
        const friendEmails = user.friends;

        if (friendEmails){
            const friends = await User.find({ email: { $in: friendEmails } });
            const friendIds = friends.map(friend => friend._id);

            await Task.updateMany(
                { userId: { $in: friendIds }, taskGroupId },
                {title, description, dueDate, status, assignee}
            )
        };
        res.status(200).json(task);
    }catch (error){
        console.error(error);
        res.status(500).json({ error: error.message || "Failed to update task" });
    };
};

export const deleteTask = async (req, res) => {
    const  {taskId} = req.params;
    const userId = req.user.id;
    try{
        const user = await User.findById(userId);
        if (!user){
            return res.status(404).json({massage:"user not found" })
        }
        const friends = await User.find( {email: {$in: user.friends}})
        const friendsIds = friends.map(friend => friend.id)
        console.log("friendsIds", friendsIds)

        const task  = await Task.findOne( {_id: taskId,userId: userId})
        console.log("task:", task)
        if (!task) {
            return res.status(404).json({ massage: "Item not found or access denied" });
        }   
        const {taskGroupId} = task;
        await Task.deleteOne({_id: taskId,userId: userId})
        await Task.deleteMany({userId: {$in: friendsIds},taskGroupId})

        res.status(200).json({ massage: "Task deleted successfully from all users" });
        }
        catch (error) {
            console.error(error)
        res.status(500).json({ error: error.message || "Failed to delete item" });
        }};