export const getUserIdFromToken = (): { userId: string; name: string } | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        // פענוח ה-payload מתוך הטוקן
        const payload = JSON.parse(atob(token.split('.')[1]));

        // בדיקה לראות את ה-payload המפוענח (לא חובה בייצור)
        console.log("Decoded payload:", payload);

        // החזרת userId ושם המשתמש
        return {
            userId: payload.user_id || null, // ודא שהמפתח הוא לפי מבנה הטוקן שלך
            name: payload.name || '' // ודא שהמפתח הוא לפי מבנה הטוקן שלך
        };
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};
export default getUserIdFromToken