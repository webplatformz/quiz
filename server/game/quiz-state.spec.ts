import {QuizState} from './quiz-state';

test('calculateBonus', () => {
    const quizState = new QuizState();
    quizState.questionStartTimestamp = 0;

    const bonus = quizState.calculateBonus(5 * 1000);

    expect(bonus).toBe(5);
});