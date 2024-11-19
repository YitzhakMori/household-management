import Event from '../models/Event.js';
import User from '../models/user.model.js';

// קבלת כל האירועים
export const getAllEvents = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    const friendsEmails = user.friends;

    // מציאת החברים לפי האימיילים שלהם
    const friends = await User.find({ email: { $in: friendsEmails } });
    const friendsIds = friends.map(friend => friend._id);

    // מציאת האירועים שהמשתמש או חבריו מורשים לראות
    const events = await Event.find({
      $or: [
        { userId: userId },
        { allowedUsers: { $in: [userId, ...friendsIds] } }
      ]
    });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events' });
  }
};


export const addEvent = async (req, res) => {
    const { title, date, description } = req.body;
    try {
      const userId = req.userId;
      const user = await User.findById(userId);
      const friendsEmails = user.friends;
  
      // מציאת החברים לפי האימיילים שלהם
      const friends = await User.find({ email: { $in: friendsEmails } });
      const friendsIds = friends.map(friend => friend._id);
  
      const newEvent = new Event({
        title,
        date,
        description,
        userId: userId,
        allowedUsers: [userId, ...friendsIds] // כולל את החברים ב-allowedUsers
      });
  
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      console.error('Error adding event:', error);
      res.status(500).json({ message: 'Error adding event' });
    }
  };


  export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
      const event = await Event.findOne({ _id: id, allowedUsers: req.userId });
      if (!event) {
        return res.status(404).json({ message: 'Event not found or access denied' });
      }
  
      await event.remove();
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Error deleting event' });
    }
  };

