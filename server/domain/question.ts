import {Answer} from './answer';

export class Question {
    constructor(public id: string, public question: string, public answers: Answer[]) {
        if (this.answers.length === 0) {
            throw Error('Question without answers is not allowed');
        }
        this.assertAtLeastOneCorrectAnswer();
    }

    private assertAtLeastOneCorrectAnswer() {
        if (!this.answers.some(answer => answer.isCorrect)) {
            throw new Error('At least 1 answer must be correct');
        }
    }

    getCorrectAnswers(): Answer[] {
        const correctAnswers = this.answers.filter(answer => answer.isCorrect);
        if(correctAnswers.length === 0) {
            throw new Error('At least 1 answer must be correct');
        }
        return correctAnswers;
    }
}
