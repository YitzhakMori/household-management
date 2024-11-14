import express from "express";
import dotenv from "dotenv";
import contactDb from "./db/contactDb.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import HouseRoutes from "./routes/House.route.js";
import adminRoutes from "./routes/adminRoutes.js";
import shoppingRoutes from "./routes/shoppingRoutes.js";
import User from './models/user.model.js'; // הייבוא של מודל המשתמש
import bcrypt from 'bcryptjs'; // ספריית bcrypt לחיזוק סיסמאות

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

const createAdmin = async () => {
    try {
        // בודק אם כבר קיים משתמש אדמין במערכת
        const existingAdmin = await User.findOne({ email: 'xyz@gmail.com' });

        if (!existingAdmin) {
            // סיסמה שאתה רוצה להגדיר לאדמין
            const plainPassword = 'yourAdminPassword123'; // הכנס כאן את הסיסמה שלך

            // הצפנת הסיסמה
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            // יצירת משתמש אדמין חדש
            const adminUser = new User({
                email: 'xyz@gmail.com',  // המייל שלך כאדמין
                password: hashedPassword,    // הסיסמה המוצפנת
                name: 'Admin User',          // שם המשתמש
                role: 'admin'                // תפקיד אדמין
            });

            // שמירת המשתמש
            await adminUser.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error creating admin:', error);
    }
};

// הפעלת הפונקציה כשאתה מפעיל את המערכת
createAdmin();


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/api/House", HouseRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shopping', shoppingRoutes);

app.listen(PORT, () => {
    contactDb();
    console.log('Server is running on port:', PORT);
});
