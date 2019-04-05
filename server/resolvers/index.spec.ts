import mockingoose from 'mockingoose';
import resolvers from './index';
import Meta from "../persistance/Meta";

test('basic', async () => {
    const _doc = {
        name: 'QuizDB',
        version: '1.0',
    };
    mockingoose(Meta).toReturn(_doc, 'findOne');

    const result = await resolvers.Query.info();

    expect(result).toBe('Hello from GraphQL and QuizDB v1.0');
});