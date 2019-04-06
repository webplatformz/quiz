import {GraphQLServer} from 'graphql-yoga'
import resolvers from './resolvers';
import express = require('express');
import path = require('path');
import MongoClient from "./persistance/MongoClient";

// Connect to MongoDB
const mongoUri = <string>process.env.MONGODB_URI;
const mongoClient = new MongoClient();
mongoClient.connectDb(mongoUri)
   .then(() => mongoClient.initDummyData());

const server = new GraphQLServer({
    typeDefs: './schema.graphql',
    resolvers
});

// Use underlying express server
server.express.use(express.static(path.join(__dirname, '../frontend/build')));

const options = {
    port: process.env.PORT || 4000,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground'
};
server.start(options, ({port}) => console.log(`Server is running on http://localhost:${port}`));