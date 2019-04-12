import {Quiz} from '../domain/quiz';
import {SimpleGuid} from '../util/simple-guid';
import {Question} from '../domain/question';

export class QuizBuilder {

    private quiz: Quiz = new Quiz(SimpleGuid.shortGuid(), SimpleGuid.shortGuid(), SimpleGuid.shortGuid());

    withName(name: string) {
        this.quiz.name = name;
        return this;
    }

    withFixedIds(quizId: string, operatorId: string, joinId: string): QuizBuilder {
        this.quiz.id = quizId;
        this.quiz.operatorId = operatorId;
        this.quiz.joinId = joinId;
        return this;
    }

    question(question: Question) {
        this.quiz.questions.push(question);
        return this;
    }

    build(): Quiz {
        return this.quiz;
    }
}