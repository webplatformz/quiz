import {Quiz} from '../domain/quiz';
import {SimpleGuid} from '../util/simple-guid';
import {Answer} from '../domain/answer';
import {Question} from '../domain/question';

class QuizRepository {
    private quizzes: Quiz[] = [];

    constructor() {
        this.setupMockQuizes();
    }

    setupMockQuizes() {
        const quiz = new Quiz('Q123', 'O123', 'J123');
        const falseAnswer = new Answer('Q1A1', 'Alpha Romeo', false);
        const correctAnswer = new Answer('Q1A2', 'Daimler', true);
        const question1 = new Question('Q1', 'Welche Automarke wurde früher gegründet?', [falseAnswer, correctAnswer]);

        const correctAnswer2 = new Answer('Q2A2', '1856', true);
        const falseAnswer2 = new Answer('Q2A1', '1895', false);
        const question2 = new Question('Q2', 'In welchem Jahr wurde Nicolas Tesla geboren?', [correctAnswer2, falseAnswer2]);

        quiz.questions = [question1, question2];
        quiz.name = 'Auto Quiz';
        this.quizzes.push(quiz);
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