import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom'
import './index.css';
import * as serviceWorker from './serviceWorker';
import {ApolloClient} from 'apollo-client'
import {createHttpLink} from 'apollo-link-http'
import {InMemoryCache, NormalizedCacheObject} from 'apollo-cache-inmemory'
import {ApolloLink, split} from 'apollo-link';
import {ApolloProvider} from "react-apollo";
import App from "./components/layout/App";
import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';
import {WebSocketLink} from "apollo-link-ws";
import {getMainDefinition} from 'apollo-utilities';
import {WebsocketUtils} from "./components/pages/WebsocketUtils";

const httpLink: ApolloLink = createHttpLink({
    uri: '/graphql'
});

const webSocketLink = new WebSocketLink({
    uri: WebsocketUtils.websocketUrlByPath('graphql'),
    options: {
        reconnect: true,
    }
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription'
    },
    webSocketLink,
    httpLink
);

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    link,
    cache: new InMemoryCache()
});


ReactDOM.render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
