const mongoose = require ("mongoose");
import { MONGODB_URL } from "./config";

mongoose.connect(MONGODB_URL); 

const userSchema = new mongoose.Schema({
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

const accountSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.objectId,
        ref:'User',
        required:true
    },
    balance:{
        type:Number,
        required:true
    }

});

 export const Account = mongoose.Model('Account',accountSchema);



 export const User = mongoose.Model('User',userSchema);

