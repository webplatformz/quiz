import {Player} from '../domain/player';
import {SimpleGuid} from "../util/simple-guid";

export class QuizState {

    joinId: string = SimpleGuid.shortGuid();

    players: Player[] = [];

    currentQuestionIndex: number = 0;

}