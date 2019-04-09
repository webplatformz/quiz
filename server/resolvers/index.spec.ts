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

test('onTest subscription is triggered for info query', (done) => {
    resolvers.Subscription.onTest.subscribe().next().then((payload: any) => {
        expect(payload.value.onTest).toBe('something happened');
        done();
    });

    resolvers.Query.info();
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