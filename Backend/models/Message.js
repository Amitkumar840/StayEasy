import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        message: {
            type: String,
            required: true
        },

        sender: {
            type: String,
            enum: ["user", "bot"],
            default: "user"
        },

        response: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;