import User from "../models/userModel.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phoneNo, sscMarks, hscMarks, qualification, location,role } = req.body

    const userExist = await User.findOne({ email })

    if (userExist) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phoneNo,
      sscMarks,
      hscMarks,
      qualification,
      location
    })

    res.status(201).json({
      message: "User registered successfully",
      user
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const matchPassword = await bcrypt.compare(password, user.password)

    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d"
    })

    res.json({
      message: "Login successful",
      token,
      user
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)

    res.json({
      message: "User deleted successfully"
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const updateUser = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      message: "User updated successfully",
      user
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
export const searchUser = async (req, res) => {
  try {

    const keyword = req.query.keyword

    const users = await User.find({
      $or: [
        { fullName: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } }
      ]
    })

    res.json(users)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}