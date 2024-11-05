import mongoose from "mongoose";

const shoppingItemSchema = new mongoose.Schema({
    familyId: {type: String, required: true},
    name: {type: String, required: true},
    quantity: {type: Number, default: 1},
    isPurchased: {type: Boolean, default: false},
})

export default mongoose.model("ShoppingItem", shoppingItemSchema);
