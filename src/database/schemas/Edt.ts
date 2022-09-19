import type { Snowflake } from "discord.js";
import { Schema, model, Document } from "mongoose";

export interface IEdtSchema extends Document {
    roleId: Snowflake;
    channelId: Snowflake;
    edtName: string;
    week: number;
    currentlyFetching: boolean;
}

const EdtSchema = new Schema<IEdtSchema>({
    roleId: {
        type: String,
        required: true,
        unique: true,
    },
    channelId: {
        type: String,
        required: true,
    },
    edtName: {
        type: String,
        required: true,
    },
    week: {
        type: Number,
        required: true,
        default: 1,
    },
    currentlyFetching: {
        type: Boolean,
        required: true,
        default: false,
    },
});

export default model<IEdtSchema>("edt", EdtSchema);
