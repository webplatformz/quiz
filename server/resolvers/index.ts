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
import {Ranking} from "../domain/ranking";
import {Triggers} from "./triggers";

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

            // Fix with admin gui - fill in default Quiz
            const falseAnswer = new Answer('A1', 'Alpha Romeo', false);
            const correctAnswer = new Answer('A2', 'Daimler', true);
            const question1 = new Question('Q1', 'Welche Automarke wurde früher gegründet?', [falseAnswer, correctAnswer]);

            const correctAnswer2 = new Answer('A2', '1856', true);
            const falseAnswer2 = new Answer('A1', '1895', false);
            const question2 = new Question('Q1', 'In welchem Jahr wurde Nicolas Tesla geboren?', [correctAnswer2, falseAnswer2]);

            quiz.questions = [question1, question2];

            return quiz.id;
        },
        join: (parent: any, {input}: { input: JoinInput }): QuizStart => {
            return GameService.getRunningGameByJoinId(input.joinId).joinAsPlayer(input.joinId, input.nickname);
        },
        joinAsOperator: (parent: any, {operatorId}: { operatorId: string }): QuizOperator => {
            const game = GameService.createOrGetGame(operatorId);
            game.registerOnPlayerJoined((quizStart: QuizStart) => {
                pubsub.publish(Triggers.PlayerJoined, {
                    onPlayerJoined: quizStart
                });
            });
            return game.getQuizOperator();
        },
        launchNextQuestion: (parent: any, {operatorId}: { operatorId: string }): Boolean => {
            const game = GameService.createOrGetGame(operatorId);
            game.publishNextQuestion((nextQuestion: Question) => {
                pubsub.publish(Triggers.NextQuestion, {
                    onNextQuestion: nextQuestion,
                    questionJoinId: game.quiz.joinId
                });
            }, (correctAnswer: Answer) => {
                pubsub.publish(Triggers.QuestionTimeout, {
                    onQuestionTimeout: correctAnswer,
                    answerJoinId: game.quiz.joinId
                });
            });
            return !game.isFinished();
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