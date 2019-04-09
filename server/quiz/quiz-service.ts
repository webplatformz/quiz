import {QuizMaster} from './quiz-master';
import QuizRepository from '../repositories/quiz-repository'
import {Quiz} from '../domain/quiz';

class QuizService {

    private activeQuizMasters: Map<string, QuizMaster> = new Map();

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

    getRunningGameByJoinId(joinId: string): QuizMaster {
        const quizMaster = Array.from(this.activeQuizMasters.values()).find(quizMaster => quizMaster.quiz.joinId === joinId);
        if (!quizMaster) {
            throw new Error(`No running game by join ID ${joinId} found.`);
        }
        return quizMaster;
    }

    private createGame(quiz: Quiz): QuizMaster {
        const quizMaster = new QuizMaster(quiz);
        this.activeQuizMasters.set(quiz.operatorId, quizMaster);
        return quizMaster;
    }

    private getRunningGame(operatorId: string): QuizMaster | undefined {
        return this.activeQuizMasters.get(operatorId);
    }

}


export default new QuizService();