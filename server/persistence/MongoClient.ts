import mongoose = require('mongoose');
import Meta from "./Meta";
import {Model} from "mongoose";

export default class MongoClient {

    public connectDb(mongoUri: string) {
        console.log('Connecting to MongoDB ...');
        return mongoose.connect(mongoUri, {useNewUrlParser: true})
            .then(() => console.log("MongoDB connected successfully"))
            .catch((error) => console.log("Connection failed: ", error));
    }

    public async initDummyData() {
        await this.dropCollections([Meta]);
        await this.addMetaDummy();
    }

    private async addMetaDummy() {
        const meta = new Meta({
            name: "Quiz-DB",
            version: "1.0"
        });
        await Meta.create(meta);

        console.log(`Added mock data for collection: ${Meta.collection.name}`);
    }

    public async dropCollections(models: Model<mongoose.Document>[]) {
        for(let model of models) {
            await this.dropCollection(model);
        }
    }

    public async dropCollection(model: Model<mongoose.Document>) {
        try {
            await model.collection.drop();
            console.log(`Collection dropped: ${model.collection.name}`);
        } catch (e) {
            if (e.code === 26) {
                console.log(`Attempted to drop non-existing collection: ${model.collection.name}`);
            } else {
                throw e;
            }
        }
    }
}