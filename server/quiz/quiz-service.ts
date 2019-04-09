import {QuizMaster} from './quiz-master';

class QuizService {

    private activeQuizMasters: { [index: string]: QuizMaster } = {};

    createOrGetGame(operatorId: string): QuizMaster {
        let runningGame = this.getRunningGame(operatorId);
        if (!runningGame) {
            runningGame = this.createGame(operatorId);
        }
        return runningGame;
    }

    private createGame(operatorId: string): QuizMaster {
        const quizMaster = new QuizMaster();
        this.activeQuizMasters[operatorId] = quizMaster;
        return quizMaster;
    }

    private getRunningGame(operatorId: string): QuizMaster {
        return this.activeQuizMasters[operatorId];
    }
}


export default new QuizService();