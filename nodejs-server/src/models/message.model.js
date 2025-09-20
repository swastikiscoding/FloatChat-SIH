import mongoose, { Schema } from "mongoose";

export const messageSchema = new Schema({
    chatId: { type: Schema.Types.ObjectId, ref: "Chat", required: true },
    type : { type: String, enum: ["AI", "User"], required: true },
}, { timestamps: true });

export const Message = mongoose.model("Message", messageSchema);