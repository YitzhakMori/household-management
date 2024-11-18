import React, { useEffect, useState } from "react";
import { fetchAllUsers, deleteUserById, searchUsers } from "../../api/adminAPI";

interface User {
  _id: string;
  name: string;
  email: string;
  lastLogin: string;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // שליפת משתמשים בטעינת הדף
  useEffect(() => {
    fetchAllUsers()
      .then(setUsers)
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // מחיקת משתמש
  const handleDelete = (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserById(userId)
        .then(() => setUsers(users.filter((user) => user._id !== userId)))
        .catch((error) => console.error("Error deleting user:", error));
    }
  };

  // חיפוש משתמשים
  const handleSearch = (query: string) => {
    searchUsers(query)
      .then(setUsers)
      .catch((error) => console.error("Error searching users:", error));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>

      {/* שדה חיפוש */}
      <input
        type="text"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearch(e.target.value);
        }}
        style={{ padding: "10px", marginBottom: "20px", width: "100%" }}
      />

      {/* טבלת משתמשים */}
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2", textAlign: "left" }}>
            <th style={{ padding: "10px" }}>Name</th>
            <th style={{ padding: "10px" }}>Email</th>
            <th style={{ padding: "10px" }}>Last Login</th>
            <th style={{ padding: "10px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={{ padding: "10px" }}>{user.name}</td>
              <td style={{ padding: "10px" }}>{user.email}</td>
              <td style={{ padding: "10px" }}>
                {new Date(user.lastLogin).toLocaleString()}
              </td>
              <td style={{ padding: "10px" }}>
                <button
                  onClick={() => handleDelete(user._id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
