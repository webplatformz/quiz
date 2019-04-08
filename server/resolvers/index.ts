import QuizRepository from '../repositories/quiz-repository';

export default {
    Query: {
        info: async (parent?: any, args?: any) => {
            return 'Hello from GraphQL 2'
        }
    },
    Mutation: {
        createQuiz: (parent?: any): string => {
            const quizId = QuizRepository.createQuiz();
            console.log(`Created quiz with ${quizId}`);
            return quizId;
        }
    }
}