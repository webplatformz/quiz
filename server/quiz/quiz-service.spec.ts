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

test('Join as operator', () => {
    const quiz = QuizRepository.createQuiz();
    const quizMaster = QuizService.createOrGetGame(quiz.operatorId);

    const quizOperator = quizMaster.joinAsOperator('Hugo');

    expect(quizOperator.operatorId).toBe(quiz.operatorId);
});