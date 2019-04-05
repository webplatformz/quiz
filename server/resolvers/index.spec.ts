import resolvers from './index';


test('basic', () => {
    expect(resolvers.Query.info()).toBe('Hello from GraphQL');
});