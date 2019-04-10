import React, {Component} from 'react'
import JoinQuiz from './JoinQuiz';
import CreateQuiz from './CreateQuiz';
import {Player} from '../../../../../server/domain/player';
import {withApollo, WithApolloClient} from 'react-apollo';
import {gql} from 'apollo-boost';
import PlayerList from './PlayerList';
import {Grid, Cell} from 'react-mdl';
import {WaitingRoom} from './WaitingRoom';
import {StartPage} from './StartPage';

interface QuizContainerState {
    joinId: string | undefined,
    operatorId: string | undefined,
    players: Player[]
}

const PLAYER_JOIN_SUBSCRIPTION = gql`
    subscription onPlayerJoined($joinId: String!){
        onPlayerJoined(joinId: $joinId) {
            players {
                id
                name
            }
        }
    }
`;

class QuizContainer extends Component<WithApolloClient<any>, QuizContainerState> {
    state: QuizContainerState = {
        joinId: undefined,
        operatorId: undefined,
        players: []
    };

    constructor(props: any) {
        super(props);
        this.joinQuiz = this.joinQuiz.bind(this);
        this.state.operatorId = this.props.match.params.operatorId;
    }

    joinQuiz(joinId: string, players: Player[]) {
        this.setState({...this.state, joinId, players});
        this.subscribeToPlayerJoined();
    }

    subscribeToPlayerJoined(): void {
        this.props.client.subscribe({
            query: PLAYER_JOIN_SUBSCRIPTION,
            variables: {
                joinId: this.state.joinId
            }
        }).subscribe((response: any) => {
            this.setState({...this.state, players: response.data.onPlayerJoined.players});
        })
    }

    render() {
        if (this.state.joinId) {
            return (
                <div style={{width: '80%', margin: 'auto', paddingTop: '16px'}}>
                    <WaitingRoom players={this.state.players} operatorId={this.state.operatorId}/>
                </div>
            );
        }

        return (
            <div style={{width: '80%', margin: 'auto'}}>
                <StartPage joinQuiz={this.joinQuiz}/>
            </div>
        )
    }
}

export default withApollo(QuizContainer);