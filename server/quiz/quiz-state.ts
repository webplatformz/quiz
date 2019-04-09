import {Player} from '../domain/player';
import {Question} from '../domain/question';

export class QuizState {

    players: Player[] = [];

    currentQuestionIndex: number = 0;

    questions: Question[] = [];
}