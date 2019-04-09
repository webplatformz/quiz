import QuizRepository from '../repositories/quiz-repository';
import GameService from '../game/game-service';
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
import {withFilter} from 'graphql-subscriptions';

const pubsub = new PubSub();


export default {
    Query: {
        info: async (parent?: any, args?: any) => {
            return 'Hello from GraphQL 2'
        }
    },
    Mutation: {
        createQuiz: (parent?: any): string => {
            const quiz = QuizRepository.createQuiz();
            return quiz.id;
        },
        join: (parent: any, {input}: { input: JoinInput }): QuizStart => {
            return GameService.getRunningGameByJoinId(input.joinId).joinAsPlayer(input.joinId, input.nickname);
        },
        joinAsOperator: (parent: any, {input}: { input: OperatorInput }): QuizOperator => {
            const game = GameService.createOrGetGame(input.operatorId);
            game.registerOnPlayerJoined((quizStart: QuizStart) => {
                pubsub.publish('PLAYER_JOINED', {
                    onPlayerJoined: quizStart
                });
            });
            return game.joinAsOperator(input.nickname);
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
        onPlayerJoined: {
            subscribe: withFilter(() => pubsub.asyncIterator('PLAYER_JOINED'),
                ({onPlayerJoined}: { onPlayerJoined: QuizStart }, {joinId}: { joinId: string }) =>
                    onPlayerJoined.joinId === joinId
            )
        }
    }
}