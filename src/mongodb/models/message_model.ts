import mongoose, { Document, Schema } from "mongoose";

interface Message {
    idMessage: string;
    idSender: string;
    idConversation: String,
    content: string;
    timestamp: string;
    status: number;
}

export interface MessageDocument extends Message, Document {}

export const MessageSchema: Schema<MessageDocument> = new Schema<MessageDocument>({
    idMessage: {
        type: String,
        required: [true, "Id is required"],
    },
    idSender: {
        type: String,
        required: [true, "Id is required"],
    },
    idConversation: {
        type: String,
        required: [true, "Id is required"],
    },
    content: {
        type: String,
        required: [true, "Content is required"],
    },
    timestamp: {
        type: String,
        default: Date.now.toString(),
    },
    status: {
        type: Number,
        required: [true, "Status is required"],
    },
});

export default mongoose.model<MessageDocument>("Message", MessageSchema)