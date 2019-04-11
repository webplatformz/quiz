import React, {Component} from 'react'
import {Player} from '../../../../../server/domain/player';
import {List, ListItem, ListItemAction, ListItemContent} from 'react-mdl';

interface RankingProps {
    players: Player[];
    isFinalState: boolean;
}

export class RankingContainer extends Component<RankingProps, any> {

    render() {
        return (
            <div>
                <div><h1>Ranking</h1></div>
                <List>
                    <ListItem>
                        <ListItemContent icon='format_list_numbered'><b>Name</b></ListItemContent>
                        <ListItemAction><b>Score</b></ListItemAction>
                    </ListItem>
                    {
                        this.props.players
                            .sort((a, b) => b.score - a.score)
                            .map((player, index) =>
                                <ListItem>
                                    <ListItemContent icon={`filter_${index + 1}`}>{player.name}</ListItemContent>
                                    <ListItemAction>{player.score}</ListItemAction>
                                </ListItem>
                            )
                    }
                </List>
            </div>
        )
    }
}