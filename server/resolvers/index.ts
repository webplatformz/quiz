import {Context} from "graphql-yoga/dist/types";

export default {
    Query: {
        info: (parent?: any, args?: any, context?: Context) => `Hello from GraphQL`,
    }
}