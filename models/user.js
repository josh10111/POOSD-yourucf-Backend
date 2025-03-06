//user.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema({
    UserId: {
        type: Number,
        unique: true,
    },
    FirstName: {
        type: String,
        required: true
    },
    LastName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    }
});

// // Hash password before saving
// UserSchema.pre('save', async function(next) {
//     if (this.isModified('Password')) {
//         this.Password = await bcrypt.hash(this.Password, 8);
//     }
//     next();
// });

module.exports = user = mongoose.model("Users", UserSchema);