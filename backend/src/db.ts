const mongoose = require ("mongoose");

mongoose.connect("mongodb+srv://sriman:SRIman%4057@paytm.6fyivlv.mongodb.net/"); 

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



const User = mongoose.Model('User',userSchema);

module.exports = {
    User
}