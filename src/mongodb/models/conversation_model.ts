import mongoose, {Schema, Document } from "mongoose";
import Message, { MessageDocument, MessageSchema } from "./message_model";

interface Conversation{
    idConversation?: string;
    members?: string[];
    timestamp?: String;
    lastMessage?: MessageDocument;
}

export interface ConversationDocument extends Conversation, Document {}

export const ConversationSchema: Schema<ConversationDocument> = new Schema<ConversationDocument>({
    idConversation: {
        type: String,
        required: [true, "Id is required"],
    },
    members: {
        type: [String],
        default: [],
    },
    timestamp: {
        type: String,
        default: Date.now,
    },
    lastMessage: {
        type: MessageSchema,
        default: null,
    },
})

export default mongoose.model<ConversationDocument>("Conversation", ConversationSchema);