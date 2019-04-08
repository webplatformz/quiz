import QuizRepository from '../repositories/quiz-repository';
import {PubSub} from 'apollo-server';

const pubsub = new PubSub();


export default {
    Query: {
        info: async (parent?: any, args?: any) => {
            pubsub.publish('TEST', 'something happened');
            return 'Hello from GraphQL 2'
        }
    },
    Mutation: {
        createQuiz: (parent?: any): string => {
            const quizId = QuizRepository.createQuiz();
            console.log(`Created quiz with ${quizId}`);
            return quizId;
        }
    },
    Subscription: {
        onTest: {
            subscribe: () => {
                const event = pubsub.asyncIterator(['TEST']);
                console.log(event);
                return 'test';
            }
        }
    }
}