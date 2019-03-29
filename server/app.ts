import {GraphQLServer} from 'graphql-yoga'
import resolvers from './resolvers';
import express = require('express');
import path = require('path');


const server = new GraphQLServer({
    typeDefs: './server/schema.graphql',
    resolvers
});

// Use underlying express server
server.express.use(express.static(path.join(__dirname, '../../frontend/build')));

const options = {
    port: process.env.PORT || 4000,
    endpoint: '/graphql',
    subscriptions: '/subscriptions',
    playground: '/playground'
};
server.start(options, ({port}) => console.log(`Server is running on http://localhost:${port}`));