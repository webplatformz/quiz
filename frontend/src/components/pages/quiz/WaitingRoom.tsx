import React, {Component} from 'react';
import {Player} from '../../../../../server/domain/player';
import PlayerList from './PlayerList';

interface WaitingRoomProps {
    players: Player[];
    operatorId: string | undefined;
}

export class WaitingRoom extends Component<WaitingRoomProps, any> {

    render() {
        return (
            <div>
                <PlayerList players={this.props.players}/>
            </div>
        );
    }
}