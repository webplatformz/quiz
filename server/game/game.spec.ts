import QuizRepository from '../repositories/quiz-repository';
import {Game} from './game';
import {QuizStart} from '../domain/quiz-start';

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

test('registerOnPlayerJoined should call callback for each operator & player joined', () => {
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