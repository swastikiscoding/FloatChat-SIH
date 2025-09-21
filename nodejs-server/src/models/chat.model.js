import mongoose from "mongoose";
import {Schema} from 'mongoose';

const chatSchema = new Schema({
    messages: [
        {
            AIMessage: {type: String, required: true},
            userMessage: {type: String, required: true}
        }
    ]
}, {timestamps: true});

export const Chat = mongoose.model('Chat', chatSchema);