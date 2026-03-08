import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    phoneNo: {
      type: String,
      required: true
    },

    sscMarks: {
      type: Number
    },

    hscMarks: {
      type: Number
    },

    qualification: {
      type: String
    },
    role: {
      type: String,
      enum: ["user", "Recruiter"],
      default: "user",
      required: true,
    },
    location: {
      type: String
    }
  },
  { timestamps: true }
)

export default mongoose.model("User", userSchema)