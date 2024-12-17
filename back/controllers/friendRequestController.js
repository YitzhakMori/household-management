import FriendRequest from '../models/friendRequestModel.js';
import User from '../models/user.model.js';
import { addFriend } from './House.controller.js';

/**
 * שליחת בקשת חברות
 */
export const sendFriendRequest = async (req, res) => {
    try {
        const { recipientEmail } = req.body;
        const senderId = req.user.id;
        const senderEmail = req.user.email;

        if (!recipientEmail) {
            return res.status(400).json({ 
                success: false,
                message: "מייל של המקבל נדרש" 
            });
        }

        // בדיקה אם המשתמש עם המייל הזה קיים
        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) {
            return res.status(404).json({ 
                success: false,
                message: "משתמש עם המייל הזה לא נמצא" 
            });
        }

        // בדיקה אם המשתמש מנסה לשלוח בקשה לעצמו
        if (senderEmail === recipientEmail) {
            return res.status(400).json({ 
                success: false,
                message: "לא ניתן לשלוח בקשת חברות לעצמך" 
            });
        }

        // בדיקה אם כבר חברים
        const sender = await User.findById(senderId);
        if (sender.friends.includes(recipientEmail)) {
            return res.status(400).json({ 
                success: false,
                message: "משתמש זה כבר נמצא ברשימת החברים שלך" 
            });
        }

        // בדיקה אם כבר קיימת בקשת חברות פעילה
        const existingRequest = await FriendRequest.findOne({
            sender: senderId,
            recipient: recipient._id,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({ 
                success: false,
                message: "בקשת החברות כבר נשלחה למשתמש זה" 
            });
        }

        // יצירת בקשת חברות חדשה
        const friendRequest = new FriendRequest({
            sender: senderId,
            senderEmail,
            recipient: recipient._id,
        });

        await friendRequest.save();

        res.status(201).json({ 
            success: true,
            message: "בקשת החברות נשלחה בהצלחה" 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: "שגיאת שרת", 
            error: error.message 
        });
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
        const { requestId } = req.body;
        const userId = req.user.id;

        // מציאת בקשת החבר
        const friendRequest = await FriendRequest.findById(requestId);
        console.log("🚀 ~ acceptFriendRequest ~ friendRequest:", friendRequest);

        if (!friendRequest) {
            return res.status(404).json({ message: "הבקשה לא נמצאה" });
        }

        // בדיקת הרשאה
        if (friendRequest.recipient.toString() !== userId.toString()) {
            return res.status(403).json({ message: "אין לך הרשאה לאשר את הבקשה הזאת" });
        }

        // קוראים ל-addFriend עם המייל בלבד
        const result = await addFriend(userId, friendRequest.senderEmail);
        console.log(userId, friendRequest.senderEmail);

        if (!result.success) {
            return res.status(400).json({ message: result.message });
        }

        // מחיקת הבקשה
        await FriendRequest.findByIdAndDelete(requestId);

        // מחזירים רק את המייל בתשובה, לא את האובייקט המלא
        res.status(200).json({ 
            success: true,
            message: "החבר נוסף בהצלחה", 
            friend: friendRequest.senderEmail // שולחים רק את המייל
        });
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




