import {Answer} from './answer';

export class Question {
    constructor(public id: number, public question: string, public answers: Answer[]) {

    }
}
