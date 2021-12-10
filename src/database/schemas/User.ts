import { Snowflake } from "discord.js";
import { Schema, model, Document } from "mongoose";

export interface IUserSchema extends Document {
    id: Snowflake,
    xp: number,
    lvl: number,
    warn: number,
}

const UserSchema = new Schema<IUserSchema>({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    xp: {
        type: Number,
        required: true,
        default: 0,
    },
    lvl: {
        type: Number,
        required: true,
        default: 0,
    },
    warn: {
        type: Number,
        required: true,
        default: 0,
    },
});

export default model<IUserSchema>("user", UserSchema);
