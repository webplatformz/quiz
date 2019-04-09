import {QuizState} from './quiz-state';
import {QuizOperator} from '../domain/quiz-operator';
import {QuizStart} from '../domain/quiz-start';
import {Player} from '../domain/player';
import {SimpleGuid} from '../util/simple-guid';

export class QuizMaster {
    private state: QuizState = new QuizState();


    joinAsOperator(nickname: string): QuizOperator {
        const player = new Player(SimpleGuid.shortGuid(), nickname, 0);



    }

    joinAsPlayer(joinId: string, nickname: string): QuizStart {

    }

    // TODO callback function with types
    registerOnPlayerJoined(callback: Function) {

    }
}