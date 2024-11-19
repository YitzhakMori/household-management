import User from "../models/user.model.js";
import shoppingItemSchemata from "../models/shoppingItemModel.js";

export const addItem = async (req, res) => {
    try {
        const { name, quantity } = req.body;

        if (!name || !quantity) {
            return res.status(400).json({ error: "הכנס שם וכמות" });
        }

        const userId = req.user.id;
        const newItem = await shoppingItemSchemata.create({ userId, name, quantity })

        const friendEmail = req.user.friends;
        console.log(friendEmail);  // לו�� ��ו����

        if (!friendEmail || friendEmail.length === 0) {
            console.log("ffffff");
            return res.status(201).json(newItem);
        }
        const friends = await User.find({ email: { $in: friendEmail } })

        // await Promise.all(friends.map(async (friend) => {
        //     await shoppingItemSchemata.create({
        //         userId: friend._id,
        //         name,
        //         quantity
        //     });
        // }));
        const itemToAdd = friends.map(friend => ({
            userId: friend._id,
            name,
            quantity
        }))
        console.log("Items to add for friends:", itemToAdd);  // לוג נוסף


        if (itemToAdd.length > 0){
            await shoppingItemSchemata.insertMany(itemToAdd)
            console.log("Items added for friends successfully!");  // וידוא אם המוצרים נשמרו

        }


        res.status(201).json(newItem)
    }
    catch (error) {
        res.status(500).json({ error: error.massage || "Failed to add item" })
    }
}


// export const getItems = async (req, res) =>{
//     try {
//         const userId = req.user.id;
//         const items = await shoppingItemSchemata.find({ userId });
//         res.json(items);
//     } catch (error) {
//         res.status(500).json({ error: error.massage || "Failed to get items" })
//     }
// }


export const getItems = async (req, res) => {
    try {
        const userId = req.user.id;

        // שליפת החברים של המשתמש
        const user = await User.findById(userId);
        const friendsEmails = user.friends || [];
        console.log("Friends emails:", friendsEmails);  // לוג למיילים של החברים


        // שליפת ה-userId של כל החברים
        const friends = await User.find({ email: { $in: friendsEmails } });
        const friendsIds = friends.map(friend => friend._id);
        console.log("Friends IDs:", friendsIds);  // לוג לכל ה־IDs של החברים


        // שליפת המוצרים של המשתמש ושל החברים
        const items = await shoppingItemSchemata.find({
            userId: { $in: [userId, ...friendsIds] }
        });
        console.log("Fetched items:", items);  // לוג של המוצרים שנשלפו


        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ error: error.message || "Failed to fetch items" });
    }
};




