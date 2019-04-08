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