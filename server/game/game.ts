import {QuizState} from './quiz-state';
import {QuizStart} from '../domain/quiz-start';
import {Player} from '../domain/player';
import {SimpleGuid} from '../util/simple-guid';
import {Quiz} from '../domain/quiz';
import {Question} from "../domain/question";
import {Answer} from "../domain/answer";

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

    registerOnPlayerJoined(callback: (quizStart: QuizStart) => void): void {
        this.onPlayerJoinedSubscribers.push(callback);
    }

    publishNextQuestion(nextQuestionCallback: (nextQuestion: Question) => void, correctAnswerCallback: (correctAnswer: Answer) => void): void {
        const currentQuestionIndex = this.state.currentQuestionIndex;
        const nextQuestion = this.quiz.questions[currentQuestionIndex];
        this.state.currentQuestionIndex++;
        if (nextQuestion) {
            nextQuestionCallback(nextQuestion);
            const correctAnswer = this.quiz.questions[currentQuestionIndex].getCorrectAnswer();
            if (!correctAnswer) {
                throw new Error(`Could not find correct answer for quiz ID ${this.quiz.id} and questionIndex ${currentQuestionIndex}.`);
            }
            setTimeout(() => {
                correctAnswerCallback(correctAnswer);
            }, 10000);
        }
    }

    isFinished(): boolean {
        return !this.quiz.questions[this.state.currentQuestionIndex - 1];
    }

    getQuizOperator(): QuizOperator {
        const quizName = this.quiz.name;
        if (!quizName) {
            throw new Error(`Quiz name must be defined to retrieve an operator for quiz with id ${this.quiz.id}`);
        }
        return new QuizOperator(quizName, this.quiz.joinId, this.quiz.operatorId, this.state.players);
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