import GameService from './game-service';
import QuizRepository from '../repositories/quiz-repository';


test('Game service throws error on non existing game', () => {

    const result = () => GameService.createOrGetGame('unknownId');

    expect(result).toThrowError('No quiz configuration with operator ID unknownId found.');

});

test('Creates game if configuration exists', () => {
    const quiz = QuizRepository.createQuiz();
    const quizMaster = GameService.createOrGetGame(quiz.operatorId);

    expect(quizMaster).toBeDefined();
});

test('getRunningGameByJoinId should return game for given joinId', () => {

    const quiz = QuizRepository.createQuiz();
    const quizMaster = GameService.createOrGetGame(quiz.operatorId);

    const returnedQuizMaster = GameService.getRunningGameByJoinId(quizMaster.quiz.joinId);

    expect(returnedQuizMaster).toEqual(quizMaster);
});

test('getRunningGameByJoinId should throw error if there is no active game for that joinId', () => {
    const result = () => GameService.getRunningGameByJoinId('unknownJoinId');

    expect(result).toThrowError('No running game by join ID unknownJoinId found.');
});