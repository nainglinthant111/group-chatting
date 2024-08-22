const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    age: { type: Number, required: false },
    gender: { type: String, required: false },
}, { timestamps: false });

const User = mongoose.model('User', userSchema);

module.exports = User;
