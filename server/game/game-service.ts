import {Game} from './game';
import QuizRepository from '../repositories/quiz-repository'
import {Quiz} from '../domain/quiz';

class GameService {

    private activeGames: Map<string, Game> = new Map();

    createOrResetGame(operatorId: string) {
        const quiz = QuizRepository.findQuizByOperatorId(operatorId);
        if (!quiz) {
            throw new Error(`No quiz configuration with operator ID ${operatorId} found.`);
        }

        return this.createGame(quiz);
    }

    getGame(operatorId: string): Game {
        const runningGame = this.getRunningGame(operatorId);
        if (!runningGame) {
            throw new Error(`No game found for operator id ${operatorId}`)
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