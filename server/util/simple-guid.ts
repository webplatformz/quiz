export class SimpleGuid {

    private static readonly ALLOWED_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz123456789";
    private static readonly SHORT_GUID_LENGTH = 6;

    static shortGuid(): string {
        let shortGuid = '';
        while(shortGuid.length < this.SHORT_GUID_LENGTH) {
            shortGuid += this.ALLOWED_CHARS.charAt(Math.floor(Math.random() * this.ALLOWED_CHARS.length));
        }
        return shortGuid;
    }
}