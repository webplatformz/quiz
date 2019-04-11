import mockingoose from 'mockingoose';
import resolvers from './index';
import Meta from '../persistence/Meta';
import {Quiz} from "../domain/quiz";


xtest('basic', async () => {
    const _doc = {
        name: 'QuizDB',
        version: '1.0'
    };
    mockingoose(Meta).toReturn(_doc, 'findOne');

    const result = await resolvers.Query.info();

    expect(result).toBe('Hello from GraphQL and QuizDB v1.0');
});

test('info', async () => {
    const result = await resolvers.Query.info();

    expect(result).toBe('Hello from GraphQL 2');
});

test('createQuiz returns an id', () => {
    const result = resolvers.Mutation.createQuiz();
    const result2 = resolvers.Mutation.createQuiz();

    expect(result.length).toBe(6);
    expect(result).not.toBe(result2);
});

describe('launchNextQuestion', () => {

    let quiz: Quiz;

    beforeEach(() => {

        const quizId = resolvers.Mutation.createQuiz();
        quiz = resolvers.Mutation.updateQuiz(undefined, {
            input: {
                id: quizId,
                name: 'MyNewQuiz',
                questions: [
                    {
                        question: 'Which day was on Jan, 1st, 2019?',
                        answers: [
                            {answer: 'Monday', isCorrect: false},
                            {answer: 'Tuesday', isCorrect: true},
                            {answer: 'Wednesday', isCorrect: false},
                            {answer: 'Thursday', isCorrect: false},
                            {answer: 'Friday', isCorrect: false},
                            {answer: 'Saturday', isCorrect: false},
                            {answer: 'Sunday', isCorrect: false}
                        ]
                    }
                ]
            }
        });
    });

    test('should return true if there is a question', () => {
        const result = resolvers.Mutation.launchNextQuestion(undefined, {operatorId: quiz.operatorId});
        expect(result).toBe(true);
    });

    test('should return false once all questions were launched', () => {
        let result = resolvers.Mutation.launchNextQuestion(undefined, {operatorId: quiz.operatorId});
        result = resolvers.Mutation.launchNextQuestion(undefined, {operatorId: quiz.operatorId});
        expect(result).toBe(false);
    });

    test('should trigger NEXT_QUESTION', (done) => {
        resolvers.Subscription.onNextQuestion.subscribe(undefined, {joinId: quiz.joinId}).next().then((payload: any) => {
            expect(payload.value.onNextQuestion.question).toBe('Which day was on Jan, 1st, 2019?');
            expect(payload.value.onNextQuestion.answers.length).toBe(7);
            done();
        });

        resolvers.Mutation.launchNextQuestion(undefined, {operatorId: quiz.operatorId});
    });

    test('should trigger QUESTION_TIMEOUT after 10 seconds', (done) => {
        jest.useFakeTimers();

        resolvers.Subscription.onQuestionTimeout.subscribe(undefined, {joinId: quiz.joinId}).next().then((payload: any) => {
            expect(payload.value.onQuestionTimeout.answer).toBe('Tuesday');
            done();
        });

        resolvers.Mutation.launchNextQuestion(undefined, {operatorId: quiz.operatorId});

        expect(setTimeout).toHaveBeenCalledTimes(1);
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 10000);

        jest.runAllTimers();
    });
});

test('onPlayerJoined subscription should trigger when player joins after the operator has joined', (done) => {
    const quizId = resolvers.Mutation.createQuiz();
    const quiz = resolvers.Mutation.updateQuiz(undefined, {
        input: {
            id: quizId,
            name: 'MyNewQuiz',
            questions: []
        }
    });

    resolvers.Mutation.joinAsOperator(undefined, {operatorId: quiz.operatorId});

    resolvers.Subscription.onPlayerJoined.subscribe(undefined, {joinId: quiz.joinId}).next().then((payload: any) => {
        expect(payload.value.onPlayerJoined.joinId).toBe(quiz.joinId);
        expect(payload.value.onPlayerJoined.name).toBe('MyNewQuiz');
        expect(payload.value.onPlayerJoined.players.length).toBe(1);
        done();
    });

    resolvers.Mutation.join(undefined, {
        input: {joinId: quiz.joinId, nickname: 'Michael'}
    });
});

test('updateQuiz updates an existing quiz', () => {
    const createdQuizId = resolvers.Mutation.createQuiz();
    const result = resolvers.Mutation.updateQuiz(undefined, {
        input: {
            id: createdQuizId,
            name: 'MyNewQuiz',
            questions: [
                {
                    question: 'Welcher Wochentag ist heute?',
                    answers: [
                        {
                            answer: 'Montag',
                            isCorrect: true

                        }, {
                            answer: 'Dienstag',
                            isCorrect: false
                        }
                    ]
                }
            ]
        }
    });

    expect(result.id).toBe(createdQuizId);
    expect(result.name).toBe('MyNewQuiz');
    expect(result.questions.length).toBe(1);
    expect(result.questions[0].answers.length).toBe(2);
});

test('updateQuiz throws error if id not exists', () => {
    const result = () => {
        resolvers.Mutation.updateQuiz(undefined, {
            input: {
                id: 'unknownId',
                name: 'MyNewQuiz',
                questions: []
            }
        });
    };
    expect(result).toThrowError('Quiz with id unknownId not found.');
});