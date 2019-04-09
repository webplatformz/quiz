import {Player} from "./player";

export class QuizStart {

    constructor(public name: string, public joinId: string, public players: Player[]) {
    }
}