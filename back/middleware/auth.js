import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: "אין הרשאה" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user_id);
        if (!user) {
            return res.status(404).json({ message: "משתמש לא נמצא" });
        }

        req.user = { id: user._id };
        next();
    } catch (error) {
        res.status(401).json({ message: "ההרשאה נכשלה" });
        console.log(error);
    }
};

export default auth;
