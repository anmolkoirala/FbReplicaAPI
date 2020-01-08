const mongoose        = require('mongoose');
const jwt             = require('jsonwebtoken');
const validator       = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    firstname: {
        type: String,
        required:true
    },
    lastname: {
        type: String,
        required:true
    },
    email: {
        type: String,
        unique: true,
        required:true
    },
    address: {
        type: String,
        required:true
    },
    dob:{
        type:String
    },
    password: {
        type: String,
        required:true
    },
    gender:{
        type:String
    },
    profilepicture:{
        type:String
    },
    tokens:[{
        token:{
            type:String,
            required:true,
        }
    }]
    });

userSchema.plugin(validator);
const User = mongoose.model('User',userSchema);
module.exports = User;

