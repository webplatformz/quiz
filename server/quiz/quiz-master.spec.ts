import QuizRepository from "../repositories/quiz-repository";
import {QuizMaster} from "./quiz-master";

test('Join as operator', () => {
    const quiz = QuizRepository.createQuiz();
    const quizMaster = new QuizMaster(quiz);

    const quizOperator = quizMaster.joinAsOperator('Hugo');

    expect(quizOperator.operatorId).toBe(quiz.operatorId);
});

test('Join as player', () => {
    const quiz = QuizRepository.createQuiz();
    const quizMaster = new QuizMaster(quiz);

    const quizStart = quizMaster.joinAsPlayer(quiz.joinId, 'Fritz');

    expect(quizStart.joinId).toBe(quiz.joinId);
    expect(quizStart.name).toBe('Fritz');
});