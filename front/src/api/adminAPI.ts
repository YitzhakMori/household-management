// שליפת כל המשתמשים
export const fetchAllUsers = async () => {
  const token = localStorage.getItem('token'); // הנחת שהטוקן נשמר ב-localStorage
  const response = await fetch("http://localhost:5001/api/admin/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  // הוספת הטוקן בכותרת
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
};

// מחיקת משתמש לפי ID
export const deleteUserById = async (userId: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5001/api/admin/users/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete user");
  }

  return response.json();
};

// חיפוש משתמשים
export const searchUsers = async (query: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`http://localhost:5001/api/admin/users/search?query=${encodeURIComponent(query)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to search users");
  }

  return response.json();
};
