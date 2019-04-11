import QuizRepository from '../repositories/quiz-repository';
import {Game} from './game';
import {QuizStart} from '../domain/quiz-start';
import {Question} from "../domain/question";
import {Answer} from "../domain/answer";

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
    const quiz = QuizRepository.createQuiz();
    const answer1 = new Answer('1', 'Alpha Romeo', false);
    const answer2 = new Answer('2', 'Mercedes', true);
    const question1 = new Question('1', 'Which car company is older', [answer1, answer2]);

    quiz.name = 'Demo Quiz';
    quiz.questions = [question1];
    const game = new Game(quiz);

    jest.useFakeTimers();

    const nextQuestionCallback = jest.fn(() => {
    });
    const correctAnswerCallback = jest.fn(() => {
    });

    game.publishNextQuestion(nextQuestionCallback, correctAnswerCallback);

    expect(nextQuestionCallback).toHaveBeenCalledTimes(1);
    expect(nextQuestionCallback).toBeCalledWith(question1);

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);

    jest.runAllTimers();
});