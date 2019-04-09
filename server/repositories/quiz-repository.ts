import {Quiz} from '../domain/quiz';
import {SimpleGuid} from '../util/simple-guid';

class QuizRepository {
    private quizes: Quiz[] = [];

    createQuiz(): Quiz {
        const quiz = new Quiz(SimpleGuid.shortGuid(), SimpleGuid.shortGuid(), SimpleGuid.shortGuid());
        this.quizes.push(quiz);
        return quiz;
    }

    findQuizByOperatorId(operatorId: string): Quiz | undefined {
        return this.quizes.find(quiz => quiz.operatorId === operatorId);
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