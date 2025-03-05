const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const autoIncrement = require('mongoose-sequence')(mongoose); 

//Create Schema
const UserSchema = new Schema({
    userId: {
        type: Number,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
    }
});

UserSchema.plugin(autoIncrement, { inc_field: 'userId' });

// UserSchema.pre('save', async function(next) {
//     if (!this.isModified('password')) return next();  // Only hash password if it's modified

//     try {
//         const salt = await bcrypt.genSalt(10);
//         this.password = await bcrypt.hash(this.password, salt);
//         next();
//     } catch (err) {
//         next(err);
//     }
// });


module.exports = user = mongoose.model("Users", UserSchema);