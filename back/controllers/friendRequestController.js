import FriendRequest from '../models/friendRequestModel.js';
import User from '../models/user.model.js';
import { addFriend } from './House.controller.js';

/**
 * שליחת בקשת חברות
 */
export const sendFriendRequest = async (req, res) => {
    try {
        const { recipientEmail } = req.body; // המייל של המקבל מגיע מגוף הבקשה
        const senderId = req.user.id; // מזהה השולח מגיע מה-middleware
        const senderEmail = req.user.email; // המייל של השולח מגיע מה-middleware

        if (!recipientEmail) {
            return res.status(400).json({ message: "מייל של המקבל נדרש" });
        }

        // בדיקה אם המשתמש עם המייל הזה קיים
        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) {
            return res.status(404).json({ message: "משתמש עם המייל הזה לא נמצא" });
        }

        // בדיקה אם כבר קיימת בקשת חברות פעילה
        const existingRequest = await FriendRequest.findOne({
            sender: senderId,
            recipient: recipient._id,
            status: 'pending',
        });

        if (existingRequest) {
            return res.status(400).json({ message: "בקשת החברות כבר נשלחה" });
        }

        // יצירת מסמך בקשת חברות
        const friendRequest = new FriendRequest({
            sender: senderId, // מזהה השולח
            senderEmail,      // שמירת המייל של השולח
            recipient: recipient._id, // מזהה המקבל
        });

        // שמירת המסמך במסד הנתונים
        await friendRequest.save();

        res.status(201).json({ message: "בקשת החברות נשלחה בהצלחה" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "שגיאת שרת", error: error.message });
    }
};

/**
 * הצגת בקשות החברות
 */

export const getFriendRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const friendRequests = await FriendRequest.find({ 
            recipient: userId, 
            status: 'pending' 
        })
        .populate('sender', 'name email')
        .exec();

        res.status(200).json({
            success: true,
            requests: friendRequests  // החזרת הבקשות האמיתיות במקום מערך ריק
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            requests: [],
            message: "שגיאת שרת"
        });
    }
};

export const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body; // מזהה הבקשה
        const userId = req.user.id;

        // מציאת בקשת החבר על פי ה-ID
        const friendRequest = await FriendRequest.findById(requestId);
        console.log("🚀 ~ acceptFriendRequest ~ friendRequest:", friendRequest);

        if (!friendRequest) {
            return res.status(404).json({ message: "הבקשה לא נמצאה" });
        }

        // בדוק אם הבקשה שייכת למשתמש הנוכחי
        if (friendRequest.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: "אין לך הרשאה לאשר את הבקשה הזאת" });
        }

        // הוסף את החבר ברשימה
        const result = await addFriend(userId, friendRequest.senderEmail);
        console.log(userId, friendRequest.senderEmail);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        // אפשר להסיר את הבקשה לאחר שאושרה
        await FriendRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: "החבר נוסף בהצלחה", friend: result.friend });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "שגיאה בשרת" });
    }
};

export const rejectFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;  // מזהה הבקשה מגיע מגוף הבקשה
        const userId = req.user.id;      // מזהה המשתמש הנוכחי מגיע מה-middleware

        // מציאת בקשת החברות לפי מזהה
        const friendRequest = await FriendRequest.findById(requestId);
        console.log("🚀 ~ rejectFriendRequest ~ friendRequest:", friendRequest);

        if (!friendRequest) {
            return res.status(404).json({ message: "הבקשה לא נמצאה" });
        }

        // בדוק אם הבקשה שייכת למשתמש הנוכחי
        if (friendRequest.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: "אין לך הרשאה לדחות את הבקשה הזאת" });
        }

        // עדכון הסטטוס ל- "rejected"
        friendRequest.status = 'rejected';
        await friendRequest.save();  // שמירה במסד הנתונים

        // מחיקת הבקשה אחרי שהיא נדחתה
        await FriendRequest.findByIdAndDelete(requestId);

        res.status(200).json({ message: "הבקשה נדחתה והוסרה בהצלחה" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "שגיאה בשרת" });
    }
};




