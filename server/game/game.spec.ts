import QuizRepository from '../repositories/quiz-repository';
import {Game} from './game';
import {QuizStart} from '../domain/quiz-start';
import {Question} from '../domain/question';
import {Answer} from '../domain/answer';
import {Quiz} from '../domain/quiz';
import {Ranking} from "../domain/ranking";

const WRONG_ANSWER_ID = 'A1';
const CORRECT_ANSWER_ID = 'A2';

function getMockGame(): Game {
    const quiz = QuizRepository.createQuiz();
    const falseAnswer = new Answer(WRONG_ANSWER_ID, 'Alpha Romeo', false);
    const correctAnswer = new Answer(CORRECT_ANSWER_ID, 'Mercedes', true);
    const question1 = new Question('Q1', 'Which car company is older', [falseAnswer, correctAnswer]);

    quiz.name = 'Demo Quiz';
    quiz.questions = [question1];
    return new Game(quiz);
}


test('Join as player', () => {
    const quiz = QuizRepository.createQuiz();
    quiz.name = 'Demo Quiz';
    const game = new Game(quiz);

    const quizStart = game.joinAsPlayer(quiz.joinId, 'Fritz');

    expect(quizStart.joinId).toBe(quiz.joinId);
    expect(quizStart.name).toBe('Demo Quiz');
});

test('registerOnPlayerJoined should call callback on player joined', () => {
    const quiz = QuizRepository.createQuiz();
    quiz.name = 'Demo Quiz';
    const game = new Game(quiz);

    const callbackFn = jest.fn((quizStart: QuizStart) => {
    });
    game.registerOnPlayerJoined(callbackFn);

    game.joinAsPlayer(quiz.joinId, 'Fritz');

    expect(callbackFn).toHaveBeenCalledTimes(1);
    expect(callbackFn.mock.calls[0][0].name).toBe('Demo Quiz');
});

test('registerOnPlayerJoined should call callback for player joined', () => {
    const quiz = QuizRepository.createQuiz();
    quiz.name = 'Demo Quiz';
    const game = new Game(quiz);

    const callbackFn = jest.fn(() => {
    });
    game.registerOnPlayerJoined(callbackFn);

    game.joinAsPlayer(quiz.joinId, 'Nick');
    game.joinAsPlayer(quiz.joinId, 'Michael');

    expect(callbackFn).toHaveBeenCalledTimes(2);
});

test('publishNextQuestion should return correct question in callback', () => {
    const game = getMockGame();

    jest.useFakeTimers();

    const nextQuestionCallback = jest.fn(() => {
    });
    const correctAnswerCallback = jest.fn(() => {
    });
    const rankingChangedCallback = jest.fn(() => {
    });

    game.publishNextQuestion(nextQuestionCallback, correctAnswerCallback, rankingChangedCallback);

    expect(nextQuestionCallback).toHaveBeenCalledTimes(1);
    const question = game.quiz.questions[0];
    expect(nextQuestionCallback).toBeCalledWith(question);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);

    jest.runAllTimers();

    expect(correctAnswerCallback).toHaveBeenCalledTimes(1);
    expect(correctAnswerCallback).toBeCalledWith(question.getCorrectAnswer());

    expect(rankingChangedCallback).toHaveBeenCalledTimes(1);
    expect(rankingChangedCallback).toBeCalledWith(new Ranking([], true));
});

test('answerQuestion updates player score', () => {
    const game = getMockGame();

    game.joinAsPlayer(game.quiz.joinId, 'Quentin');
    const quizStart = game.joinAsPlayer(game.quiz.joinId, 'Fritz');
    game.publishNextQuestion(()=>{}, ()=> {},()=> {});

    const player1 = quizStart.players[0];
    const player2 = quizStart.players[1];
    game.answerQuestion(player1.id, CORRECT_ANSWER_ID);
    game.answerQuestion(player2.id, WRONG_ANSWER_ID);

    // Fast test should be around 20 but you never know
    expect(player1.score).toBeGreaterThan(15);
    expect(player2.score).toBe(0);
});
