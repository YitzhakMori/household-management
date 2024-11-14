// adminRoutes.js

import express from 'express';
import { getAllUsers, deleteUser, searchUsers } from '../controllers/adminController.js';
import { adminOnly } from '../middleware/adminMiddleware.js'; // ייבוא של ה-middleware לבדיקה אם המשתמש הוא אדמין
import auth from '../middleware/auth.js'; // ייבוא של ה-middleware לאימות משתמשים

const router = express.Router();

// נתיב לקבלת כל המשתמשים (רק לאדמין)
router.get('/users', auth, adminOnly, getAllUsers);

// נתיב למחיקת משתמש (רק לאדמין)
router.delete('/users/:userId', auth, adminOnly, deleteUser);

// נתיב לחיפוש משתמשים (רק לאדמין)
router.get('/users/search', auth, adminOnly, searchUsers);

export default router;
