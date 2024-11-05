import express from "express";
import contactDb from "./db/contactDb.js";
import dotenv from "dotenv";
import HouseRoutes from "./routes/House.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import shoppingRoutes from "./routes/shoppingRoutes.js";

dotenv.config();

const PORT = process.env.PORT  || 5001
const app = express()

app.use(cors());
app.use(express.json())
app.use(cookieParser())
app.use("/api/House", HouseRoutes)

app.use('/api/shopping', shoppingRoutes);


app.listen(PORT, () => {
    contactDb()
    console.log('server is running on port:',PORT)
})