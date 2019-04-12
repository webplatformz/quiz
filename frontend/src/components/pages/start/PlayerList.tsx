import React, {Component} from 'react'
import {Player} from "../../../../../server/domain/player";
import {ListItemContent, List, ListItem, CardTitle, CardText, Textfield, Button, Card, Spinner} from 'react-mdl';

interface PlayerListProps {
    players: Player[]
}

class PlayerList extends Component<PlayerListProps, any> {

    render() {
        const playerList = this.props.players.map((player: Player) => {
            return (
                <ListItem key={player.id} style={{padding: 0, minHeight: '36px'}}>
                    <ListItemContent icon="person" >{player.name}</ListItemContent>
                </ListItem>
            );
        });

        if(playerList.length > 0) {
            return <List style={{margin: 0}}>{playerList}</List>;
        }
        return <p>Waiting for players to join ...</p>;
    }
}

export default PlayerList;