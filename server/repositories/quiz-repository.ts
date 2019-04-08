import {Quiz} from '../domain/quiz';
import {SimpleGuid} from '../util/simple-guid';

class QuizRepository {
    private quizes: Quiz[] = [];

    createQuiz(): string {
        const shortQuizId = SimpleGuid.shortGuid();
        this.quizes.push(new Quiz(shortQuizId));
        return shortQuizId;
    }


    getQuizes(): Quiz[] {
        return this.quizes;
    }

}

export default new QuizRepository();