import {QuizState} from './quiz-state';
import {QuizOperator} from '../domain/quiz-operator';
import {QuizStart} from '../domain/quiz-start';
import {Player} from '../domain/player';
import {SimpleGuid} from '../util/simple-guid';
import {Quiz} from '../domain/quiz';

export class Game {
    private state: QuizState = new QuizState();
    private onPlayerJoinedSubscribers: ((quizStart: QuizStart) => void)[] = [];

    constructor(public quiz: Quiz) {

    }

    joinAsOperator(nickname: string): QuizOperator {
        const player = new Player(SimpleGuid.shortGuid(), nickname, 0);
        this.state.players.push(player);
        this.notifyOnPlayerJoinedSubscribers();
        return new QuizOperator(player.name, this.state.joinId, this.quiz.operatorId);
    }

    joinAsPlayer(joinId: string, nickname: string): QuizStart {
        const player = new Player(SimpleGuid.shortGuid(), nickname, 0);
        this.state.players.push(player);
        if(!this.quiz.name) {
            throw new Error(`The quiz with ID ${this.quiz.id} is not ready to join - it misses a name.`);
        }
        this.notifyOnPlayerJoinedSubscribers();
        return new QuizStart(this.quiz.name, joinId, this.state.players);
    }

    registerOnPlayerJoined(callback: (quizStart: QuizStart) => void) {
        this.onPlayerJoinedSubscribers.push(callback);
    }

    private notifyOnPlayerJoinedSubscribers() {
        this.onPlayerJoinedSubscribers.forEach(subscriber => {
            if(!this.quiz.name) {
                throw new Error(`The quiz with ID ${this.quiz.id} is not ready yet - it misses a name.`);
            }
            subscriber(new QuizStart(this.quiz.name, this.quiz.joinId, this.state.players));
        });
    }
}