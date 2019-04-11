import {Player} from "./player";

export class QuizStart {

    constructor(public name: string, public joinId: string, public playerId: string, public players: Player[]) {
    }
}