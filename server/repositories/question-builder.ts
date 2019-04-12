import {Question} from '../domain/question';
import {Answer} from '../domain/answer';
import {SimpleGuid} from '../util/simple-guid';

export class QuestionBuilder {
    private question: string | undefined;

    private answers: Answer[] = [];

    withQuestion(question: string) {
        this.question = question;
        return this;
    }

    withAnswer(answer: string, isCorrect: boolean): QuestionBuilder {
        this.answers.push(new Answer(SimpleGuid.shortGuid(), answer, isCorrect));
        return this;
    }

    build(): Question {
        if (!this.question) {
            throw new Error(`Question is not defined.`);
        }

        return new Question(SimpleGuid.shortGuid(), this.question, this.answers);
    }
}