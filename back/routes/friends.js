import express from 'express';
import { User } from '../models/user.model.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/add', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { friendEmail } = req.body;

        if (!friendEmail) {
            return res.status(400).json({ message: "יש להזין מייל של חבר" });
        }

        const friendUser = await User.findOne({ email: friendEmail });
        if (!friendUser) {
            return res.status(404).json({ message: "המשתמש המבוקש לא נמצא" });
        }

        const user = await User.findById(userId);
        if (user.friends.includes(friendEmail)) {
            return res.status(400).json({ message: "החבר כבר קיים ברשימה" });
        }

        user.friends.push(friendEmail);
        await user.save();

        res.status(200).json({ message: "החבר נוסף בהצלחה" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "שגיאה בשרת" });
    }
});

export default router;
