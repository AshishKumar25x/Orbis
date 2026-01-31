import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    skills: {
      type: [String],
      default: [],
    },
    basicInfo: {
      name: { type: String, default: "" },
      gender: { type: String},
      location: {
        country: { type: String, default: "" },
        state: { type: String, default: "" },
        city: { type: String, default: "" },
      },
      work: { type: [String], default: [] },
      education: { type: [String], default: [] },
      birthday: { type: Date },
    },
    account: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      leetcode: { type: String, default: "" },
      gmail: { type: String, default: "" },
      portfolio: { type: String, default: "" },
    },
    createdProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    joinedProjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", userSchema);
