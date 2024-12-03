import express from 'express';
import { addSavings, getSavings, deleteSavings, updateSavings } from '../controllers/savingsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/add', auth, addSavings);
router.get('/', auth, getSavings);
router.put('/:id', auth, updateSavings);
router.delete('/:id', auth, deleteSavings);

export default router;
