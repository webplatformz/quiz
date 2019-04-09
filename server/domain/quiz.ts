import {Question} from './question';

export class Quiz {

    joinId: string | undefined;

    operatorId: string | undefined;

    name: string | undefined;

    questions: Question[] = [];

    constructor(public id: string) {

    }

}