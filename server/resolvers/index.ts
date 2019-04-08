import {isMongoDbEnabled} from '../persistence';
import MongoDbRepository from '../repositories/mongdb-repository';
import {Quiz} from '../domain/quiz';

export default {
    Query: {
        info: async (parent?: any, args?: any) => {
            if (isMongoDbEnabled()) {
                const meta = await MongoDbRepository.getMeta();
                return `Hello from GraphQL and ${meta.name} v${meta.version}`;
            } else {
                return 'Hello from GraphQL 2'
            }
        }
    },
    Mutation: {
        createQuiz: async (parent: any, {input}: {input: Quiz}) => {
            console.log(JSON.stringify(input));
            input.id = 1;
            return input;
        }
    }
}