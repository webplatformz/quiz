import mockingoose from 'mockingoose';
import resolvers from './index';
import Meta from '../persistence/Meta';

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

test('onPlayerJoined subscription should trigger when operator joins', (done) => {
    const quizId = resolvers.Mutation.createQuiz();
    const quiz = resolvers.Mutation.updateQuiz(undefined, {
        input: {
            id: quizId,
            name: 'MyNewQuiz',
            questions: []
        }
    });

    resolvers.Subscription.onPlayerJoined.subscribe(undefined, {joinId: quiz.joinId}).next().then((payload: any) => {
        expect(payload.value.onPlayerJoined.joinId).toBe(quiz.joinId);
        expect(payload.value.onPlayerJoined.name).toBe('MyNewQuiz');
        done();
    });

    resolvers.Mutation.joinAsOperator(undefined, {
        input: {operatorId: quiz.operatorId, nickname: "Hans"}
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

    resolvers.Mutation.joinAsOperator(undefined, {
        input: {operatorId: quiz.operatorId, nickname: "Hans"}
    });

    resolvers.Subscription.onPlayerJoined.subscribe(undefined, {joinId: quiz.joinId}).next().then((payload: any) => {
        expect(payload.value.onPlayerJoined.joinId).toBe(quiz.joinId);
        expect(payload.value.onPlayerJoined.name).toBe('MyNewQuiz');
        expect(payload.value.onPlayerJoined.players.length).toBe(2);
        done();
    });

    resolvers.Mutation.join(undefined, {
        input: {joinId: quiz.joinId, nickname: "Michael"}
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