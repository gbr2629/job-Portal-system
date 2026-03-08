import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import userRoutes from "./routes/userRoutes.js"
import jobRoutes from "./routes/jobRoutes.js"



dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

connectDB()

app.use("/users", userRoutes)
app.use("/jobs", jobRoutes)

app.get("/", (req, res) => {
  res.send("Job Portal API Running")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
   console.log(`http://localhost:${PORT}`)
})