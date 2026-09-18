import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        match: [/^[A-Za-z\s]+$/, "Full name must contain only alphabets and spaces"]
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        minlength: 2,
        maxlength: 50,
        match: [/^[a-zA-Z1-9!@#$%^&*]+$/, "Username must contain letters, numbers 1-9, and symbols"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email format"]
    },
    mobileNumber: {
        type: String,
        required: [true, "Mobile number is required"],
        match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"]
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);