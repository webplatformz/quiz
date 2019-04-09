import React, {Component} from 'react'
import JoinQuiz from "./JoinQuiz";
import CreateQuiz from "./CreateQuiz";
import {Player} from "../../../../../server/domain/player";
import {withApollo, WithApolloClient} from "react-apollo";
import {gql} from "apollo-boost";
import PlayerList from "./PlayerList";
import {Grid, Cell} from 'react-mdl';

interface QuizContainerState {
    joinId: string,
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
        joinId: "",
        players: []
    };

    constructor(props: any) {
        super(props);
        this.joinQuiz = this.joinQuiz.bind(this);
    }

    joinQuiz(joinId: string) {
        this.setState({...this.state, joinId: joinId});
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
                    <PlayerList players={this.state.players}/>
                </div>
            );
        }

        return (
            <div style={{width: '80%', margin: 'auto'}}>
                <Grid>
                    <Cell col={6}>
                        <JoinQuiz joinQuiz={this.joinQuiz}/>
                    </Cell>
                    <Cell col={6}>
                        <CreateQuiz/>
                    </Cell>
                </Grid>
            </div>
        )
    }
}

export default withApollo(QuizContainer);