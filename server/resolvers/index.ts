import {Player} from '../domain/player';
import {QuizStart} from "../domain/quiz-start";
import {PubSub} from 'apollo-server';
import QuizRepository from '../repositories/quiz-repository';

const pubsub = new PubSub();

export default {
    Query: {
        info: async (parent?: any, args?: any) => {
            pubsub.publish('TEST', {onTest: 'something happened'});
            return 'Hello from GraphQL 2'
        }
    },
    Mutation: {
        createQuiz: (parent?: any): string => {
            const quizId = QuizRepository.createQuiz();
            console.log(`Created quiz with ${quizId}`);
            return quizId;
        },
        join: async (parent: any, {joinId}: { joinId: string }): Promise<QuizStart> => {
            console.log(JSON.stringify(joinId));
            const players = [
                new Player(1, "Daniel", 0),
                new Player(2, "Ben", 0),
                new Player(3, "Andi", 0),
                new Player(4, "Martin", 0)
            ];

            return new QuizStart("Dummy", joinId, players);
        }
    },
    Subscription: {
        onTest: {
            subscribe: () => pubsub.asyncIterator(['TEST'])
        }
    }
}