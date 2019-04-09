import {QuizState} from './quiz-state';
import {QuizOperator} from '../domain/quiz-operator';
import {QuizStart} from '../domain/quiz-start';
import {Player} from '../domain/player';
import {SimpleGuid} from '../util/simple-guid';
import {Quiz} from '../domain/quiz';

export class Game {
    private state: QuizState = new QuizState();

    constructor(public quiz: Quiz) {

    }

    joinAsOperator(nickname: string): QuizOperator {
        const player = new Player(SimpleGuid.shortGuid(), nickname, 0);
        this.state.players.push(player);
        return new QuizOperator(player.name, this.state.joinId, this.quiz.operatorId);
    }

    joinAsPlayer(joinId: string, nickname: string): QuizStart {
        const player = new Player(SimpleGuid.shortGuid(), nickname, 0);
        this.state.players.push(player);
        return new QuizStart(player.name, joinId, this.state.players);
    }

    // TODO callback function with types
    registerOnPlayerJoined(callback: Function) {

    }
}