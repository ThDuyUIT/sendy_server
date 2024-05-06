import mongoose, { Schema, Document } from "mongoose";
import { ConversationSchema, ConversationDocument } from "./conversation_model";

interface User {
    idUser: string;
    uid: string;
    name: string;
    email: string;
    gender?: number;
    //birthday?: Date;
    urlAvatar?: string | null;
    conversation?: ConversationDocument[];
    activeStatus?: boolean;
}

export interface UserDocument extends User, Document {}

export const UserSchema: Schema<UserDocument> = new Schema<UserDocument>({
    idUser: {
        type: String,
        required: [true, "Id is required"],
    },
    uid: {
        type: String,
        required: [true, "Uid is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    gender: {
        type: Number,
        default: -1,
    },
    // birthday: {
    //     type: Date,
    //     default: null,
    // },
    urlAvatar: {
        type: String,
        default: null,
    },
    conversation: {
        type: [ConversationSchema],
        default: [],
    },
    activeStatus: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.model<UserDocument>("User", UserSchema);
