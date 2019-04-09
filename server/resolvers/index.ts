import QuizRepository from '../repositories/quiz-repository';
import QuizService from '../quiz/quiz-service';
import {Player} from '../domain/player';
import {QuizStart} from '../domain/quiz-start';
import {PubSub} from 'apollo-server';
import {Quiz} from '../domain/quiz';
import {QuizInput} from '../domain/quiz-input';
import {SimpleGuid} from '../util/simple-guid';
import {Question} from '../domain/question';
import {Answer} from '../domain/answer';
import {JoinInput} from '../domain/join-input';
import {QuizOperator} from '../domain/quiz-operator';
import {OperatorInput} from '../domain/operator-input';

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
        join: (parent: any, {input}: { input: JoinInput }): QuizStart => {
            const players = [
                new Player("1", "Daniel", 0),
                new Player("2", "Ben", 0),
                new Player("3", "Andi", 0),
                new Player("4", "Martin", 0)
            ];

            return new QuizStart("Dummy", input.joinId, players);
        },
        joinAsOperator: (parent: any, {input}: { input: OperatorInput }): QuizOperator => {
            const quizMaster = QuizService.createOrGetGame(input.operatorId);
            return quizMaster.joinAsOperator(input.nickname);
        },
        updateQuiz: (parent: any, {input}: { input: QuizInput }): Quiz => {
            const quiz = QuizRepository.find(input.id);
            if (!quiz) {
                throw new Error(`Quiz with id ${input.id} not found.`);
            }

            quiz.name = input.name;
            quiz.questions = input.questions.map(questionInput => {
                const generatedQuestionId = SimpleGuid.shortGuid();
                const answers = questionInput.answers.map(answerInput => {
                    const generatedAnswerId = SimpleGuid.shortGuid();
                    return new Answer(generatedAnswerId, answerInput.answer, answerInput.isCorrect);
                });
                return new Question(generatedQuestionId, questionInput.question, answers);
            });

            return QuizRepository.update(quiz);
        }
    },
    Subscription: {
        onTest: {
            subscribe: () => pubsub.asyncIterator(['TEST'])
        }
    }
}