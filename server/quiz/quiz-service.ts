import {QuizMaster} from './quiz-master';
import QuizRepository from '../repositories/quiz-repository'
import {Quiz} from '../domain/quiz';

class QuizService {

    private activeQuizMasters: { [index: string]: QuizMaster } = {};

    createOrGetGame(operatorId: string): QuizMaster {
        let runningGame = this.getRunningGame(operatorId);
        if (!runningGame) {
            const quiz = QuizRepository.findQuizByOperatorId(operatorId);
            if (!quiz) {
                throw new Error(`No quiz configuration with operator ID ${operatorId} found.`);
            }

            runningGame = this.createGame(quiz);
        }
        return runningGame;
    }

    private createGame(quiz: Quiz): QuizMaster {
        const quizMaster = new QuizMaster(quiz);
        this.activeQuizMasters[quiz.operatorId] = quizMaster;
        return quizMaster;
    }

    private getRunningGame(operatorId: string): QuizMaster {
        return this.activeQuizMasters[operatorId];
    }
}


export default new QuizService();