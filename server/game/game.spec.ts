import QuizRepository from "../repositories/quiz-repository";
import {Game} from "./game";

test('Join as operator', () => {
    const quiz = QuizRepository.createQuiz();
    const game = new Game(quiz);

    const quizOperator = game.joinAsOperator('Hugo');

    expect(quizOperator.operatorId).toBe(quiz.operatorId);
});

test('Join as player', () => {
    const quiz = QuizRepository.createQuiz();
    const game = new Game(quiz);

    const quizStart = game.joinAsPlayer(quiz.joinId, 'Fritz');

    expect(quizStart.joinId).toBe(quiz.joinId);
    expect(quizStart.name).toBe('Fritz');
});