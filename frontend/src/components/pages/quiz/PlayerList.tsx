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
                <ListItem>
                    <ListItemContent icon="person" key={player.id}>{player.name}</ListItemContent>
                </ListItem>
            );
        });

        let content = <p>Waiting for players to join ...</p>;
        if(playerList.length > 0) {
            content = <List>{playerList}</List>;
        }
        return (
            <Card shadow={0} style={{width: '500px', margin: 'auto'}}>
                <CardTitle style={{textAlign: "center"}}>Players</CardTitle>
                <CardText>
                    {content}
                    <Spinner />
                </CardText>
            </Card>
        )
    }
}

export default PlayerList;