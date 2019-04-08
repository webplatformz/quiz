import resolvers from './resolvers';
import MongoClient from './persistence/MongoClient';
import {isMongoDbEnabled} from './persistence';
import express = require('express');
import path = require('path');
import {ApolloServer} from 'apollo-server-express';
import {gql} from 'apollo-server';
import * as fs from 'fs';
import http from 'http';


// Connect to MongoDB
if (isMongoDbEnabled()) {
    const mongoClient = new MongoClient();
    mongoClient.connectDb(<string>process.env.MONGODB_URI)
        .then(() => mongoClient.initDummyData());
} else {
    console.log(`Environment variable MONGO_URI not defined. Not connecting to MongoDB`);
}

const typeDefs = gql(
    fs.readFileSync(path.join(__dirname, '../schema.graphql'), 'utf8')
);


const app = express();
app.use(express.static(path.join(__dirname, '../../frontend/build')));


const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true
});
server.applyMiddleware({app, path: '/graphql'});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);


const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
});