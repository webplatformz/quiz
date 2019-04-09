import {Question} from './question';

export class Quiz {

    name: string | undefined;

    questions: Question[] = [];

    constructor(public id: string, public operatorId: string, public joinId: string) {

    }

}