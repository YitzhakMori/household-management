import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res, user_id) => {
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    // שמירה של הטוקן בעוגיה (cookie)
    res.cookie("token", token, {
        httpOnly: true, // לא ניתן לגשת אליו בעזרת JavaScript
        secure: process.env.NODE_ENV === "production", // רק ב-https
        sameSite: "strict", // הגנה מפני CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // טווח זמן לתוקף של העוגיה
    });

    // החזרת הטוקן בתגובה
    return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        token: token,  // שליחת הטוקן לצד הלקוח
    });
};

