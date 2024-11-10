// src/utils/utils.ts
export function getUserIdFromToken(): string | null {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
                const payload = atob(tokenParts[1]);
                const decodedPayload = JSON.parse(payload);
                return decodedPayload.userId || null;
            }
        } catch (error) {
            console.error("Failed to decode token:", error);
        }
    }
    return null;
}
