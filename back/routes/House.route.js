import express from "express";
import { login, logOut, signUp ,verifyEmail,forgotPassword,resetPassword,checkAuth, addFriend,removeFriend} from "../controllers/House.controller.js";
import { auth } from "../middleware/auth.js";
import { verifyToken } from "../middleware/verifyToken.js";

const route = express.Router();


route.get("/check-auth",verifyToken,checkAuth)


route.post("/signup", signUp)
route.post("/login",login)
route.post("/logOut",logOut)
route.post("/verify-email",verifyEmail) 
route.post("/forgot-password",forgotPassword) 
route.post("/reset-password/:token", resetPassword);
route.post('/add', auth, addFriend);
route.delete('/delete', auth,removeFriend);



export default route;