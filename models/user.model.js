import mongoose from "mongoose";

let UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    attempts:{
        type: Number,
        default: 0,
    },
    blockedTill:{
        type: Date,
        default: null,
    }
});


let User = mongoose.model("user", UserSchema);

export default User;
