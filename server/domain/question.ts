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

    getCorrectAnswer(): Answer {
        const correctAnswer = this.answers.find(answer => answer.isCorrect);
        if(!correctAnswer) {
            throw new Error('At least 1 answer must be correct');
        }
        return correctAnswer;
    }
}
