import {Quiz} from '../domain/quiz';

export default {
    Query: {
        info: async (parent?: any, args?: any) => {
            return 'Hello from GraphQL 2'
        }
    },
    Mutation: {
        createQuiz: async (parent: any, {input}: { input: Quiz }) => {
            console.log(JSON.stringify(input));
            input.id = 1;
            return input;
        }
    }
}