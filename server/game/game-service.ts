import {Game} from './game';
import QuizRepository from '../repositories/quiz-repository'
import {Quiz} from '../domain/quiz';

class GameService {

    private activeGames: Map<string, Game> = new Map();

    createOrGetGame(operatorId: string): Game {
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

    getRunningGameByJoinId(joinId: string): Game {
        const activeGame = Array.from(this.activeGames.values()).find(activeGame => activeGame.quiz.joinId === joinId);
        if (!activeGame) {
            throw new Error(`No running game by join ID ${joinId} found.`);
        }
        return activeGame;
    }

    private createGame(quiz: Quiz): Game {
        const activeGame = new Game(quiz);
        this.activeGames.set(quiz.operatorId, activeGame);
        return activeGame;
    }

    private getRunningGame(operatorId: string): Game | undefined {
        return this.activeGames.get(operatorId);
    }

}


export default new GameService();