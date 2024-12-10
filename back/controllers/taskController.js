import User from "../models/user.model.js";
import Task from '../models/taskModel.js'
import mongoose from "mongoose";

export const addTask = async (req, res) => {
    try {
        const {title, description, dueDate, status, assignee, priority} = req.body;
        console.log('Received task data:', req.body);

        const taskGroupId = new mongoose.Types.ObjectId();

        if (!title) {
            return res.status(400).json({error: "שדה הכותרת הוא חובה"});
        }

        const userId = req.user.id;
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: "User authentication failed" });
        }

        // אם יש assignee, וודא שהוא נמצא ברשימת החברים
        if (assignee) {
            const user = await User.findById(userId);
            if (!user || !user.friends.includes(assignee)) {
                return res.status(400).json({ error: "המשתמש המוקצה חייב להיות חבר" });
            }
        }
        
        const newTask = await Task.create({
            userId,
            title,
            description: description || "",
            dueDate: dueDate || null,
            status: status || "Open",
            assignee: assignee || null,
            priority: priority || "Medium",
            taskGroupId
        });

        // עדכון המשימה אצל החברים
        if (req.user.friends && req.user.friends.length > 0) {
            const friends = await User.find({ email: { $in: req.user.friends } });
            const tasksToAdd = friends.map(friend => ({
                userId: friend._id,
                title,
                description: description || "",
                dueDate: dueDate || null,
                status: status || "Open",
                assignee: assignee || null,
                priority: priority || "Medium",
                taskGroupId
            }));

            if (tasksToAdd.length > 0) {
                await Task.insertMany(tasksToAdd);
            }
        }

        res.status(201).json(newTask);
    } catch (error) {
        console.error('Error in addTask:', error);
        return res.status(500).json({ 
            error: error.message || "שגיאה ביצירת משימה"
        });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const userId = req.user.id;   
         // מוצא את המשתמש כדי לקבל את רשימת החברים שלו
         const user = await User.findById(userId);
        const tasks = await Task.find({userId});
        res.json({tasks,
            friends: user.friends || []
    });
    }catch (error) {
        res.status(500).json({error: error.massage || "Failed to get tasks"})
    }
}

export const updateTask = async  (req, res) => {
    const  {taskId} = req.params
    const {title, description, dueDate, status, assignee, priority} = req.body;
    const userId = req.user.id
   
     
    try{
        if (assignee) {
            const user = await User.findById(userId);
            if (!user.friends.includes(assignee)) {
                return res.status(400).json({ error: "המשתמש המוקצה חייב להיות חבר" });
            }
        }
        const task = await Task.findOne({_id: taskId, userId: userId});
        console.log("🚀 ~ updateTask ~ task:", task)
        
        if (!task){
            return res.status(404).json({message: "Task not found"})
        }
        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.status = status || task.status;
        task.assignee = assignee 
        task.priority = priority || task.priority;


        
        await task.save();
        
        const {taskGroupId} = task;

        const user = await User.findById(userId);
        const friendEmails = user.friends;

        if (friendEmails){
            const friends = await User.find({ email: { $in: friendEmails } });
            const friendIds = friends.map(friend => friend._id);

            await Task.updateMany(
                { userId: { $in: friendIds }, taskGroupId },
                {title, description, dueDate, status, assignee,priority}
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

        const task  = await Task.findOne( {_id: taskId,userId: userId})
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