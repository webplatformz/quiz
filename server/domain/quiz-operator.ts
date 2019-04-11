import {Player} from "./player";

export class QuizOperator {
    constructor(public name: string, public joinId: string, public operatorId: string, public players: Player[]) {

    }
}