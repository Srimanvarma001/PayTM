const mongoose = require ("mongoose");
import { MONGODB_URL } from "./config";

mongoose.connect(MONGODB_URL); 

const userSchema = mongoose.Schema({
    username: {
        type:String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    lastname: {
        type:String,
        required: true

    },
    firstname:{
        type: String,
        required: true,
        maxLength: 50

    },
    password: {
        type:String,
        required: true,
        minLength: 6
    }
});



 export const User = mongoose.Model('User',userSchema);

