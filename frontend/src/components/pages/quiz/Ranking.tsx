import React, {Component} from 'react'
import {List, ListItem, ListItemAction, ListItemContent} from 'react-mdl';
import {Ranking} from "../../../../../server/domain/ranking";

interface RankingProps {
    ranking: Ranking
}

export class RankingContainer extends Component<RankingProps, any> {

    render() {
        return (
            <div>
                <div><h5>Ranking</h5></div>
                <List>
                    <ListItem key="header">
                        <ListItemContent icon='format_list_numbered'><b>Name</b></ListItemContent>
                        <ListItemAction><b>Score</b></ListItemAction>
                    </ListItem>
                    {
                        this.props.ranking.players
                            .sort((a, b) => b.score - a.score)
                            .map((player, index) =>
                                <ListItem key={player.id}>
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