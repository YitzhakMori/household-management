import express from "express";
import { addItem, getItems, updateItem, deleteItem } from '../controllers/shoppingController.js';

const router = express.Router();



router.post("/addItem", addItem);
router.get("/:familyId", getItems);
router.put("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);

export default router;