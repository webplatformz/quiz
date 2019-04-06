import {Context} from 'graphql-yoga/dist/types';
import {isMongoDbEnabled} from '../persistance';
import MongoDbRepository from '../repositories/mongdb-repository';

export default {
    Query: {
        info: async (parent?: any, args?: any, context?: Context) => {
            if (isMongoDbEnabled()) {
                const meta = await MongoDbRepository.getMeta();
                return `Hello from GraphQL and ${meta.name} v${meta.version}`;
            } else {
                return 'Hello from GraphQL'
            }
        }
    },
    Mutation: {
        addQuiz: async (parent: any, args: any) => {
            console.log(JSON.stringify(args));
            return undefined;
        }
    }
}