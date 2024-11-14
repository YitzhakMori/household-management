import jwt from 'jsonwebtoken';
import  User  from '../models/user.model.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) {
            return res.status(401).json({ message: "אין הרשאה" });
        }

        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        const user = await User.findById(decoded.user_id);
        if (!user) {
            return res.status(404).json({ message: "משתמש לא נמצא" });
        }

        // הוספת המידע של המשתמש (כולל ה-role) ל-req.user
        req.user = { 
            id: user._id, 
            role: user.role,  // הוספת ה-role
            email: user.email  // אם צריך מידע נוסף
        };
        next();
    } catch (error) {
        res.status(401).json({ message: "ההרשאה נכשלה" });
        console.log(error);
    }
};


export default auth;
