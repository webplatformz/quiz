import * as mongoose from "mongoose";

export interface IMeta extends mongoose.Document {
    name: string;
    version: string;
}

export const MetaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    version: {type: String, required: true }
});

const Meta = mongoose.model<IMeta>("meta", MetaSchema);
export default Meta;