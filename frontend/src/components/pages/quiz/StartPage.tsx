import React, {Component} from 'react';
import {Player} from '../../../../../server/domain/player';
import PlayerList from './PlayerList';
import {Cell, Grid} from 'react-mdl';
import JoinQuiz from './JoinQuiz';
import CreateQuiz from './CreateQuiz';

interface StartPageProps {
    joinQuiz: (joinId: string, players: Player[]) => void
}

export class StartPage extends Component<StartPageProps, any> {

    render() {
        return (
            <div>
                <Grid>
                    <Cell col={6}>
                        <JoinQuiz joinQuiz={this.props.joinQuiz}/>
                    </Cell>
                    <Cell col={6}>
                        <CreateQuiz/>
                    </Cell>
                </Grid>
            </div>
        );
    }
}