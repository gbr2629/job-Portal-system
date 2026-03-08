import express from "express"
import { registerUser, loginUser, getUsers, deleteUser,updateUser ,searchUser } from "../controllers/userController.js"

const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/", getUsers)
router.delete("/:id", deleteUser)
router.put("/:id", updateUser)
router.get("/search", searchUser)

export default router