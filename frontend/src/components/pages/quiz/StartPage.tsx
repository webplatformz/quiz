import React, {Component} from 'react';
import {Player} from '../../../../../server/domain/player';
import {Card, Cell, Grid} from 'react-mdl';
import JoinQuiz from './JoinQuiz';
import CreateQuiz from './CreateQuiz';

interface StartPageProps {
    joinQuiz: (joinId: string, playerId: string, players: Player[]) => void
}

export class StartPage extends Component<StartPageProps, any> {

    render() {
        return (
            <Card shadow={3} style={{flex: '1'}}>
                <Grid>
                    <Cell col={6} >
                        <JoinQuiz joinQuiz={this.props.joinQuiz}/>
                    </Cell>
                    <Cell col={6}>
                        <CreateQuiz/>
                    </Cell>
                </Grid>
            </Card>
        );
    }
}