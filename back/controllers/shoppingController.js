import ShoppingItem from "../models/shoppingItemModel.js";


export const addItem = async (req, res) => {
    try {
        const {name, quantity, familyId} = req.body;
        const newItem = await ShoppingItem.create({name, quantity, familyId});
        res.status(201).json(newItem);
    }
    catch (error) {
        res.status(500).json({error: 'Failed to add item'});

    }
};

export const getItems = async (req, res) => {
    try {
        const {familyId} = req.params;
        const items = await ShoppingItem.find({familyId});
        res.status(200).json(items);
    }
    catch (error) {
        res.status(500).json({error: 'Failed to fetch items'});
    }
}

export const updateItem = async (req, res) => {
    try {
        const {itemId} = req.params;
        const updatedItem =  await ShoppingItem.findByIdAndUpdate(itemId, req.body, {new: true});
        res.status(200).json(updatedItem);
    }
    catch (error) {
        res.status(500).json({error: 'Failed to update item'});
    }     
}

export const deleteItem = async (req, res) => {
    try {
        const {itemId} = req.params;
        await ShoppingItem.findByIdAndDelete(itemId);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({error: 'Failed to delete item'});
    }
}