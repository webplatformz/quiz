import {Question} from './question';

export class Quiz {

    secondsToAnswer: number = 10;

    questions: Question[] = [];

    constructor(public id: string) {

    }

}