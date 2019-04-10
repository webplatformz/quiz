import {QuizState} from './quiz-state';
import {QuizStart} from '../domain/quiz-start';
import {Player} from '../domain/player';
import {SimpleGuid} from '../util/simple-guid';
import {Quiz} from '../domain/quiz';
import {Question} from "../domain/question";

export class Game {
    private state: QuizState = new QuizState();
    private onPlayerJoinedSubscribers: ((quizStart: QuizStart) => void)[] = [];

    constructor(public quiz: Quiz) {

    }

    joinAsPlayer(joinId: string, nickname: string): QuizStart {
        const player = new Player(SimpleGuid.shortGuid(), nickname, 0);
        this.state.players.push(player);
        if (!this.quiz.name) {
            throw new Error(`The quiz with ID ${this.quiz.id} is not ready to join - it misses a name.`);
        }
        this.notifyOnPlayerJoinedSubscribers();
        return new QuizStart(this.quiz.name, joinId, this.state.players);
    }

    registerOnPlayerJoined(callback: (quizStart: QuizStart) => void) {
        this.onPlayerJoinedSubscribers.push(callback);
    }

    getNextQuestion(): Question | undefined {
        const index = ++this.state.currentQuestionIndex;
        return index >= this.state.questions.length ? undefined : this.state.questions[index];
    }

    private notifyOnPlayerJoinedSubscribers() {
        this.onPlayerJoinedSubscribers.forEach(subscriber => {
            if (!this.quiz.name) {
                throw new Error(`The quiz with ID ${this.quiz.id} is not ready yet - it misses a name.`);
            }
            subscriber(new QuizStart(this.quiz.name, this.quiz.joinId, this.state.players));
        });
    }
}