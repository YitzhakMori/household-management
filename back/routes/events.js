import { Router } from 'express';
import { addEvent, deleteEvent, getAllEvents } from '../controllers/eventsController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = Router();

router.post('/add', authenticateToken, addEvent);
router.get('/', authenticateToken, getAllEvents);
router.delete('/:id', authenticateToken, deleteEvent);

export default router;
