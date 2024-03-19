export default class ServiceError extends Error {
    constructor(message, type) {
        super(message);
        this.type = type;
    }
}