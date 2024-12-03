import  User  from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendResetSuccessEmail, sendVerificationEmail } from "../mailtrap/emails.js";
import { sendWelcomeEmail } from "../mailtrap/emails.js";
import { sendPasswordResetEmail } from "../mailtrap/emails.js";





export const signUp = async (req, res) => {
    const { name, email, password } = req.body
    try {
        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" })
        }

        const userAlreadyExist = await User.findOne({ email })
        if (userAlreadyExist) {
            return res.status(400).json({ success: false, message: "User already exist" })
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString()
        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
        })

        await user.save()
        const token = generateTokenAndSetCookie(res, user._id)
        // await sendVerificationEmail(user.email, verificationToken)



        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user.toObject(),
                password: undefined
            },
            token: token,
        })
    }

    catch (error) {
        console.error("error in signUp ", error);
        return res.status(500).json({ success: false, message: error.message })
    }
}


export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code

        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });

        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();


        await sendWelcomeEmail(user.email, user.name);

        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("error in verifyEmail ", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcryptjs.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // יצירת טוקן ושמירתו בעוגיה
        const token = generateTokenAndSetCookie(res, user._id,user.role); // שמירה בעוגיה והחזרת הטוקן

        // עדכון זמן הכניסה האחרון של המשתמש
        user.lastLogin = new Date();
        await user.save();


         // החזרת מידע משתמש בצורה נקייה מבלי לכלול מעגלים או מידע מיותר
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        return res.status(200).json({
            success: true,
            message: "logged in successfully",
            user: userWithoutPassword,
            token,
        });

    } catch (error) {
        console.log("error in login ", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};



export const logOut = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetTokenExpiresAt;
        await user.save();
        await sendPasswordResetEmail(user.email, `http://localhost:3000/reset-password/${resetToken}`);
        res.status(200).json({ success: true, message: "Password reset email sent" });
    } catch (error) {
        console.log("error in forgotPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }
        const hashedPassword = await bcryptjs.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        await sendResetSuccessEmail(user.email);

        res.status(200).json({ success: true, message: "Password reset successful" });
    } catch (error) {
        console.log("Error in resetPassword ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.user_id).select("-password");
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });

        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth ", error);
        res.status(400).json({ success: false, message: error.message });
    }
};


export const addFriend = async (userId, friendEmail) => {
    try {
        if (!friendEmail) {
            return { success: false, message: "יש להזין מייל של חבר" };
        }

        const user = await User.findById(userId);
        if (!user) {
            return { success: false, message: "משתמש לא נמצא" };
        }

        if (user.email === friendEmail) {
            return { success: false, message: "לא ניתן להוסיף את עצמך כחבר" };
        }

        const friendUser = await User.findOne({ email: friendEmail });
        if (!friendUser) {
            return { success: false, message: "המשתמש המבוקש לא נמצא" };
        }

        if (user.friends.includes(friendEmail)) {
            return { success: false, message: "החבר כבר קיים ברשימה" };
        }

        user.friends.push(friendEmail);
        await user.save();
        console.log("🚀 ~ user saved successfully:", user);

        friendUser.friends.push(user.email);
        await friendUser.save();
        console.log("🚀 ~ friendUser saved successfully:", friendUser);

        return { success: true, message: "החבר נוסף בהצלחה", friend: friendUser };
    } catch (error) {
        console.error(error);
        return { success: false, message: "שגיאה בשרת" };
    }
};


export const removeFriend = async (req,res)=> {
    try{
        const userId = req.user.id;
        const { friendEmail } = req.body;

        if (!friendEmail){
            return res.status(400).json({massage: "יש להזין מייל למחיקה"})
        }

        const user = await User.findById(userId);
        const friendUser = await User.findOne({email: friendEmail})

        if (!friendUser){
            return res.status(404).json({massage: "המשתמש המבוקש לא נמצא"})
        }
        if (!user.friends.includes(friendEmail)){
            return res.status(400).json({massage: "מייל זה אינו מופיע בחברים שלך"})
        }
       
      
        user.friends = user.friends.filter(friend => friend!== friendEmail);
        await user.save();

        const userEmail =user.email
        friendUser.friends = friendUser.friends.filter(friend => friend!== userEmail);
        await friendUser.save();

        res.status(200).json({message: "מייל זה הוסר בהצלחה מהרשימה"})
    }catch (error) {
        console.error(error);
        res.status(500).json({message: "שגיאה בשרת"})

    }

}
    
