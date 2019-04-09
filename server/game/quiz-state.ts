import {Player} from '../domain/player';
import {Question} from '../domain/question';
import {SimpleGuid} from "../util/simple-guid";

export class QuizState {

    joinId: string = SimpleGuid.shortGuid();

    players: Player[] = [];

    currentQuestionIndex: number = 0;

    questions: Question[] = [];

}