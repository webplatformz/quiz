import {Answer} from './answer';

export class Question {
    constructor(public id: string, public question: string, public answers: Answer[]) {

    }
}
