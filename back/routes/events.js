import { Router } from 'express';
import { addEvent, deleteEvent, getAllEvents, updateEvent } from '../controllers/eventsController.js';
import auth from '../middleware/auth.js';
const router = Router();

router.post('/add', auth, addEvent);
router.get('/', auth, getAllEvents);
router.delete('/:id', auth, deleteEvent);
router.put('/:id', auth, updateEvent);
export default router;
