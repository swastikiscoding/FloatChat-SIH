import mongoose from "mongoose";
import {Schema} from 'mongoose';

const chatSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    messages: [
        {
            AIMessage: {type: String, required: true},
            userMessage: {type: String, required: true},
            plots_data: {type: Array, required: false, default: []}
        }
    ]
}, {timestamps: true});

export const Chat = mongoose.model('Chat', chatSchema);