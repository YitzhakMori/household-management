import express from "express";
import { addItem, getItems} from '../controllers/shoppingController.js';
import auth from "../middleware/auth.js";

const router = express.Router();



router.post("/addItem", auth, addItem);
router.get("/", auth, getItems);
// router.put("/:itemId", updateItem);
// router.delete("/:itemId", deleteItem);

export default router;