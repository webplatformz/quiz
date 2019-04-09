import {Quiz} from '../domain/quiz';
import {SimpleGuid} from '../util/simple-guid';

class QuizRepository {
    private quizes: Quiz[] = [];

    createQuiz(): string {
        const shortQuizId = SimpleGuid.shortGuid();
        this.quizes.push(new Quiz(shortQuizId));
        return shortQuizId;
    }

    find(id: string): Quiz | undefined {
        return this.quizes.find(quiz => quiz.id === id);
    }

    update(quiz: Quiz): Quiz {
        const otherQuizes = this.quizes.filter(inMemoryQuiz => inMemoryQuiz.id !== quiz.id);
        otherQuizes.push(quiz);
        this.quizes = otherQuizes;
        return quiz;
    }

    getQuizes(): Quiz[] {
        return this.quizes;
    }

}

export default new QuizRepository();