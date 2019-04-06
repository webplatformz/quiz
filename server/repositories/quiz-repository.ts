import {Quiz} from '../domain/quiz';

class QuizRepository {
    quizes: Quiz[] = [];

    addQuiz(quiz: Quiz) {
        this.quizes.push(quiz);
    }

    getQuizes(): Quiz[] {
        return this.quizes;
    }


}

export default new QuizRepository();