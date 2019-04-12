import {Quiz} from '../domain/quiz';
import {SimpleGuid} from '../util/simple-guid';
import {Answer} from '../domain/answer';
import {Question} from '../domain/question';
import {QuizBuilder} from './quiz-builder';
import {QuestionBuilder} from './question-builder';

class QuizRepository {
    private quizzes: Quiz[] = [];

    constructor() {
        this.setupMockQuizes();
    }

    setupMockQuizes() {
        const campQuiz = new QuizBuilder()
            .withName('Bulgarien Camp Quiz 2019')
            .withFixedIds('Q123', 'O123', 'J123')
            .question(new QuestionBuilder()
                .withQuestion('Welche Automarke wurde früher gegründet?')
                .withAnswer('Alpha Romea', false)
                .withAnswer('Daimler', true)
                .withAnswer('Tesla', false)
                .build())
            .question(new QuestionBuilder()
                .withQuestion('In welchem Jahr wurde Nicolas Tesla geboren?')
                .withAnswer('1856', true)
                .withAnswer('1895', false)
                .withAnswer('1870', false)
                .build())
            .question(new QuestionBuilder()
                .withQuestion('Wer hat Ricola erfunden?')
                .withAnswer('Bulgarien', true)
                .withAnswer('Russland', false)
                .withAnswer('Schweiz', true)
                .withAnswer('Deutschland', false)
                .build())
            .question(new QuestionBuilder()
                .withQuestion('Wer hat Red Bull erfunden?')
                .withAnswer('Bulgarien', true)
                .withAnswer('Frankreich', false)
                .withAnswer('Schweiz', false)
                .withAnswer('Österreich', true)
                .build())
            .question(new QuestionBuilder()
                .withQuestion('Wie viele Einwohner hat Bulgarien?')
                .withAnswer(`7'000'000`, true)
                .withAnswer(`6'000'000`, false)
                .withAnswer(`5'500'000`, false)
                .withAnswer(`7'900'000`, false)
                .build())
            .question(new QuestionBuilder()
                .withQuestion('Aus wie vielen Kräuter ist Jägermeister gemacht?')
                .withAnswer(`12`, false)
                .withAnswer(`16`, false)
                .withAnswer(`27`, false)
                .withAnswer(`56`, true)
                .build())
            .question(new QuestionBuilder()
                .withQuestion('Wie viele Nachbarländer hat Bulgarien')
                .withAnswer(`5`, true)
                .withAnswer(`4`, false)
                .withAnswer(`8`, false)
                .withAnswer(`6`, false)
                .build())
            .question(new QuestionBuilder()
                .withQuestion('In welcher europäischen Stadt gibt es die meisten Brücken?')
                .withAnswer(`Venedig`, false)
                .withAnswer(`Hamburg`, true)
                .withAnswer(`Amsterdam`, false)
                .withAnswer(`Bern`, false)
                .build())
            .build();

        this.quizzes.push(campQuiz);
    }

    createQuiz(): Quiz {
        const quiz = new Quiz(SimpleGuid.shortGuid(), SimpleGuid.shortGuid(), SimpleGuid.shortGuid());
        this.quizzes.push(quiz);
        return quiz;
    }

    findQuizByOperatorId(operatorId: string): Quiz | undefined {
        return this.quizzes.find(quiz => quiz.operatorId === operatorId);
    }

    find(id: string): Quiz | undefined {
        return this.quizzes.find(quiz => quiz.id === id);
    }

    update(quiz: Quiz): Quiz {
        const otherQuizes = this.quizzes.filter(inMemoryQuiz => inMemoryQuiz.id !== quiz.id);
        otherQuizes.push(quiz);
        this.quizzes = otherQuizes;
        return quiz;
    }

    getQuizes(): Quiz[] {
        return this.quizzes;
    }

}

export default new QuizRepository();