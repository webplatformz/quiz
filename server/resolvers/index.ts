import {Context} from 'graphql-yoga/dist/types';
import {isMongoDbEnabled} from '../persistence';
import MongoDbRepository from '../repositories/mongdb-repository';
import {Quiz} from '../domain/quiz';
import {Player} from '../domain/player';
import {QuizStart} from "../domain/quiz-start";

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
        createQuiz: async (parent: any, {input}: {input: Quiz}) => {
            console.log(JSON.stringify(input));
            input.id = 1;
            return input;
        },
        join: async (parent: any, {joinId}: {joinId: string}): Promise<QuizStart> => {
            console.log(JSON.stringify(joinId));
            const players = [
                new Player(1,"Daniel", 0),
                new Player(2, "Ben", 0),
                new Player(3, "Andi", 0),
                new Player(4,"Martin", 0)
            ];

            return new QuizStart("Dummy", joinId, players);
        }
    }
}