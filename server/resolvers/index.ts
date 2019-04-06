import {Context} from 'graphql-yoga/dist/types';
import Meta, {IMeta} from '../persistance/Meta';

export default {
    Query: {
        info: async (parent?: any, args?: any, context?: Context) => {
            const meta = <IMeta>await Meta.findOne();
            return `Hello from GraphQL and ${meta.name} v${meta.version}`;
        }
    },
    Mutation: {
        addQuiz: async (parent: any, args: any) => {
            console.log(JSON.stringify(args));
            return undefined;
        }
    }
}