import "dotenv/config";
import mongoose from "mongoose";
import { MONGODB_URL } from "./config";




mongoose.connect(MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30
  },
  lastName: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true,
    maxLength: 50
  },
  password: {
    type: String,
    required: true,
    minLength: 6
  }
});

export const User = mongoose.model("User", userSchema);

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  balance: {
    type: Number,
    required: true
  }
});


const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  with: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
transactionSchema.index({ userId: 1, timestamp: -1 });

export const Transaction = mongoose.model('Transaction', transactionSchema);


export const Account = mongoose.model("Account", accountSchema);
