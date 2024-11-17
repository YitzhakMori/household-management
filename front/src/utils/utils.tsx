// src/utils/utils.ts
import { jwtDecode } from 'jwt-decode';
export const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        // פענוח ה-payload מתוך הטוקן
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Decoded payload:", payload); // בדיקה לראות את ה-payload המפוענח
        return payload.user_id || null; // שים לב להשתמש ב-user_id לפי מבנה הטוקן
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};