import {Player} from '../domain/player';
import {SimpleGuid} from '../util/simple-guid';

export class QuizState {

    joinId: string = SimpleGuid.shortGuid();
    players: Player[] = [];
    currentQuestionIndex: number = -1;
    questionStartTimestamp: number = -1;

    getPlayerById(playerId: string): Player | undefined {
        return this.players.find(player => player.id === playerId);
    }

    calculateBonus(currentTimestamp: number): number {
        return Math.ceil(10 - ((currentTimestamp - this.questionStartTimestamp) / 1000));
    }
}