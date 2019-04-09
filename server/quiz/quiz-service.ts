import {QuizMaster} from './quiz-master';

class QuizService {



    createOrGetGame(operatorId: string): QuizMaster {
        let runningGame = this.getRunningGame(operatorId);
        if (!runningGame) {
            runningGame = this.createGame(operatorId);
        }

        return runningGame;
    }

    private createGame(joinOrOperatorId: string): QuizMaster {

    }

    private getRunningGame(joinOrOperatorId: string): QuizMaster {

    }
}


export default new QuizService();