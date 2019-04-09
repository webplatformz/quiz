import QuizService from '../quiz/quiz-service';
import QuizRepository from '../repositories/quiz-repository';


test('Quiz service throws error on non existing game', () => {

    const result = () => QuizService.createOrGetGame('unknownId');

    expect(result).toThrowError('No quiz configuration with operator ID unknownId found.');

});

test('Creates quiz if configuration exists', () => {
    const quiz = QuizRepository.createQuiz();
    const quizMaster = QuizService.createOrGetGame(quiz.operatorId);

    expect(quizMaster).toBeDefined();
});

test('getRunningGameByJoinId should return QuizMaster for given joinId', () => {

    const quiz = QuizRepository.createQuiz();
    const quizMaster = QuizService.createOrGetGame(quiz.operatorId);

    const returnedQuizMaster = QuizService.getRunningGameByJoinId(quizMaster.quiz.joinId);

    expect(returnedQuizMaster).toEqual(quizMaster);
});

test('getRunningGameByJoinId should throw error if there is no active QuizMaster for that joinId', () => {
    const result = () => QuizService.getRunningGameByJoinId('unknownJoinId');

    expect(result).toThrowError('No running game by join ID unknownJoinId found.');
});