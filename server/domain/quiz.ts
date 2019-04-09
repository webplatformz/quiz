import {Question} from './question';
import {QuizOperator} from './quiz-operator';

export class Quiz {

    name: string | undefined;

    questions: Question[] = [];

    constructor(public id: string, public operatorId: string, public joinId: string) {

    }

    getQuizOperator(): QuizOperator {
        const quizName = this.name;
        if (!quizName) {
            throw new Error(`Quiz name must be defined to retrieve an operator for quiz with id ${this.id}`);
        }
        return new QuizOperator(quizName, this.joinId, this.operatorId)
    }
}