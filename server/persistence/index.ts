export function isMongoDbEnabled(): boolean {
    return <string>process.env.MONGODB_URI !== undefined;

}