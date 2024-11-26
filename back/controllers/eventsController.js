import Event from '../models/Event.js';
import User from '../models/user.model.js';
import eventSchema from "../models/Event.js"
import mongoose from 'mongoose';


export const getAllEvents = async (req, res) =>{
    try {
        const userId = req.user.id;
        const items = await eventSchema.find({ userId });
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: error.massage || "Failed to get items" })
    }
}

export const addEvent = async (req, res) => {
  const { title, date, description } = req.body;
  try {
    const userId = req.user.id;

    // יצירת מזהה ייחודי לקבוצה של האירועים
    const eventGroupId = new mongoose.Types.ObjectId();

    // יצירת האירוע עבור המשתמש הראשי
    const newEvent = await Event.create({
      userId,
      title,
      date,
      description,
      eventGroupId
    });

    const friendEmails = req.user.friends;

    if (!friendEmails || friendEmails.length === 0) {
      return res.status(201).json(newEvent);
    }

    // מציאת החברים לפי המיילים
    const friends = await User.find({ email: { $in: friendEmails } });

    // הכנת האירועים עבור החברים עם אותו eventGroupId
    const eventToAdd = friends.map(friend => ({
      userId: friend._id,
      title,
      date,
      description,
      eventGroupId
    }));

    if (eventToAdd.length > 0) {
      await Event.insertMany(eventToAdd);
      console.log("Items added for friends successfully!");
    }

    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Error adding event' });
  }
};

export const deleteEvent = async (req, res) => {
  const { id } = req.params;
  try {
    // מציאת האירוע עבור המשתמש הראשי
    const event = await Event.findOne({ _id: id, userId: req.user.id });
    if (!event) {
      return res.status(404).json({ message: 'Event not found or access denied' });
    }

    // מחיקת האירוע עבור המשתמש הראשי
    await Event.deleteOne({ _id: id, userId: req.user.id });

    // מציאת המשתמש הראשי
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // מציאת החברים של המשתמש
    const friends = await User.find({ email: { $in: user.friends } });
    const friendIds = friends.map(friend => friend._id);

    // מחיקת האירועים של החברים עם אותו eventGroupId
    await Event.deleteMany({ userId: { $in: friendIds }, eventGroupId: event.eventGroupId });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
};

export const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, date, description } = req.body;

    try {
        // מציאת האירוע עבור המשתמש הראשי
        const event = await Event.findOne({ _id: id, userId: req.user.id });
        if (!event) {
            return res.status(404).json({ message: 'Event not found or access denied' });
        }

        // עדכון האירוע עבור המשתמש הראשי
        event.title = title;
        event.date = date;
        event.description = description;
        await event.save();

        // מציאת החברים של המשתמש הראשי
        const user = await User.findById(req.user.id);
        const friendEmails = user.friends;
        if (friendEmails && friendEmails.length > 0) {
            const friends = await User.find({ email: { $in: friendEmails } });
            const friendIds = friends.map(friend => friend._id);

            // עדכון האירועים עבור החברים של המשתמש הראשי לפי eventGroupId
            await Event.updateMany(
                { userId: { $in: friendIds }, eventGroupId: event.eventGroupId },
                { title, date, description }
            );
        }

        res.status(200).json(event);
          } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ message: 'Error updating event' });
    }
};