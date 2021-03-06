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
import {withFilter} from 'graphql-subscriptions';
import {Ranking} from '../domain/ranking';
import {Triggers} from './triggers';

const pubsub = new PubSub();

export default {
    Query: {
        info: async (parent?: any, args?: any) => {
            return `Hi from the Z-QUIZ server. It's ${new Date()}`;
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
        joinAsOperator: (parent: any, {operatorId}: { operatorId: string }): QuizOperator => {
            const game = GameService.createOrResetGame(operatorId);
            game.registerOnPlayerJoined((quizStart: QuizStart) => {
                pubsub.publish(Triggers.PlayerJoined, {
                    onPlayerJoined: quizStart
                });
            });
            return game.getQuizOperator();
        },
        launchNextQuestion: (parent: any, {operatorId}: { operatorId: string }): Boolean => {
            const game = GameService.getGame(operatorId);
            return game.publishNextQuestion((nextQuestion: Question) => {
                pubsub.publish(Triggers.NextQuestion, {
                    onNextQuestion: nextQuestion,
                    questionJoinId: game.quiz.joinId
                });
            }, (correctAnswers: Answer[]) => {
                pubsub.publish(Triggers.QuestionTimeout, {
                    onQuestionTimeout: correctAnswers,
                    answerJoinId: game.quiz.joinId
                });
            }, (changedRanking: Ranking) => {
                pubsub.publish(Triggers.RankingChanged, {
                    onRankingChanged: changedRanking,
                    rankingJoinId: game.quiz.joinId
                });
            });
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
        },
        answerQuestion: (parent: any, {joinId, playerId, answerId}: { joinId: string, playerId: string, answerId: string }) => {
            const runningGame = GameService.getRunningGameByJoinId(joinId);
            if (!runningGame) {
                throw new Error(`Game with joinId ${joinId} not found.`);
            }
            runningGame.answerQuestion(playerId, answerId);
            return true;
        }
    },
    Subscription: {
        onPlayerJoined: {
            subscribe: withFilter(() => pubsub.asyncIterator(Triggers.PlayerJoined),
                ({onPlayerJoined}: { onPlayerJoined: QuizStart }, {joinId}: { joinId: string }) =>
                    onPlayerJoined.joinId === joinId
            )
        },
        onNextQuestion: {
            subscribe: withFilter(() => pubsub.asyncIterator(Triggers.NextQuestion),
                ({onNextQuestion, questionJoinId}: { onNextQuestion: Question, questionJoinId: string }, {joinId}: { joinId: string }) =>
                    questionJoinId === joinId
            )
        },
        onQuestionTimeout: {
            subscribe: withFilter(() => pubsub.asyncIterator(Triggers.QuestionTimeout),
                ({onQuestionTimeout, answerJoinId}: { onQuestionTimeout: Answer, answerJoinId: string }, {joinId}: { joinId: string }) =>
                    answerJoinId === joinId
            )
        },
        onRankingChanged: {
            subscribe: withFilter(() => pubsub.asyncIterator(Triggers.RankingChanged),
                ({onRankingChanged, rankingJoinId}: { onRankingChanged: Ranking, rankingJoinId: string }, {joinId}: { joinId: string }) =>
                    rankingJoinId === joinId
            )
        }
    }
}