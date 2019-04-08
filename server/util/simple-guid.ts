export class SimpleGuid {
    static shortGuid(): string {
        return Math.random().toString(36).replace(/[^(a-z)|(0-9)]+/g, '')
            .substr(0, 6).toUpperCase();
    }
}