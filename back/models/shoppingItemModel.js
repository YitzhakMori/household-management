import mongoose from "mongoose";

const shoppingItemSchema = new mongoose.Schema({
    userId: {type: mongoose.Schema.ObjectId, ref: "users",required: true},
    name: {type: String, required: true},
    quantity: {type: Number, default: 1},
    isPurchased: {type: Boolean, default: false},
    users:[{type: String}]
})

export default mongoose.model("ShoppingItem", shoppingItemSchema);
