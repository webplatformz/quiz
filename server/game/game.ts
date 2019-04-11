import {QuizState} from './quiz-state';
import {QuizStart} from '../domain/quiz-start';
import {Player} from '../domain/player';
import {SimpleGuid} from '../util/simple-guid';
import {Quiz} from '../domain/quiz';
import {Question} from '../domain/question';
import {Answer} from '../domain/answer';
import {QuizOperator} from '../domain/quiz-operator';
import {Ranking} from '../domain/ranking';

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
        this.notifyOnPlayerJoinedSubscribers(player.id);
        return new QuizStart(this.quiz.name, joinId, player.id, this.state.players);
    }

    registerOnPlayerJoined(callback: (quizStart: QuizStart) => void): void {
        this.onPlayerJoinedSubscribers.push(callback);
    }

    publishNextQuestion(nextQuestionCallback: (nextQuestion: Question) => void,
                        correctAnswerCallback: (correctAnswer: Answer) => void,
                        rankingCallback: (ranking: Ranking) => void): boolean {
        this.state.currentQuestionIndex++;
        const currentQuestionIndex = this.state.currentQuestionIndex;
        const nextQuestion = this.getCurrentQuestion();

        if (!nextQuestion) {
            return false;
        }

        const correctAnswer = this.quiz.questions[currentQuestionIndex].getCorrectAnswer();
        if (!correctAnswer) {
            throw new Error(`Could not find correct answer for quiz ID ${this.quiz.id} and questionIndex ${currentQuestionIndex}.`);
        }

        const isLastQuestion = currentQuestionIndex >= this.quiz.questions.length - 1;

        nextQuestionCallback(nextQuestion);

        setTimeout(() => {
            correctAnswerCallback(correctAnswer);
            rankingCallback(new Ranking(this.state.players, isLastQuestion));
            this.state.questionStartTimestamp = -1;
            console.log("Sent Q-Timout", correctAnswer);
        }, 10000);

        this.state.questionStartTimestamp = new Date().getTime();
        return true;
    }

    private getCurrentQuestion() {
        return this.quiz.questions[this.state.currentQuestionIndex];
    }

    getQuizOperator(): QuizOperator {
        const quizName = this.quiz.name;
        if (!quizName) {
            throw new Error(`Quiz name must be defined to retrieve an operator for quiz with id ${this.quiz.id}`);
        }
        return new QuizOperator(quizName, this.quiz.joinId, this.quiz.operatorId, this.state.players);
    }

    // Does not check, if a player answers multiple times
    answerQuestion(playerId: string, answerId: string): void {
        const currentTimestamp = new Date().getTime();
        const currentQuestion = this.getCurrentQuestion();
        const correctAnswer = currentQuestion.getCorrectAnswer();

        const player: Player | undefined = this.state.getPlayerById(playerId);
        if (answerId === correctAnswer.id && player) {
            const bonus = this.state.calculateBonus(currentTimestamp);
            player.score += 10 + bonus;
        }
    }

    private notifyOnPlayerJoinedSubscribers(playerId: string) {
        this.onPlayerJoinedSubscribers.forEach(subscriber => {
            if (!this.quiz.name) {
                throw new Error(`The quiz with ID ${this.quiz.id} is not ready yet - it misses a name.`);
            }
            subscriber(new QuizStart(this.quiz.name, this.quiz.joinId, playerId, this.state.players));
        });
    }
}