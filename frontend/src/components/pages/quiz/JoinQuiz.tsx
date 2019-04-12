import React, {Component} from 'react'
import {gql} from 'apollo-boost';
import {withApollo, WithApolloClient} from 'react-apollo';
import {Button, Textfield} from 'react-mdl';
import {Player} from '../../../../../server/domain/player';
import {withToastManager} from 'react-toast-notifications';

interface JoinQuizState {
    joinId: string,
    nickname: string
}

interface JoinQuizProps {
    joinQuiz: (joinId: string, playerId: string, players: Player[]) => void
    toastManager: any
}

const JOIN_MUTATION = gql`
    mutation join($joinId: String!, $nickname: String!){
        join(input: { joinId: $joinId, nickname: $nickname}) {
            joinId,
            playerId,
            players {
                id
                name
            }
        }
    }
`;

class JoinQuiz extends Component<WithApolloClient<JoinQuizProps>, JoinQuizState> {
    state: JoinQuizState = {
        joinId: '',
        nickname: ''
    };

    constructor(props: WithApolloClient<JoinQuizProps>) {
        super(props);
        this.joinQuiz = this.joinQuiz.bind(this);
    }

    isJoinDisabled(): boolean {
        return this.state.joinId.trim().length === 0 || this.state.nickname.trim().length === 0;
    }

    joinQuiz(): void {
        this.props.client.mutate({
            mutation: JOIN_MUTATION,
            variables: {
                joinId: this.state.joinId,
                nickname: this.state.nickname
            }
        })
            .then((response: any) => this.props.joinQuiz(
                response.data.join.joinId,
                response.data.join.playerId,
                response.data.join.players)
            )
            .catch(() => {
                this.showErrorToast("No quiz with this ID found. Please check if your ID is correct.")
            });
    }

    render() {
        return (
            <div>
                <h4 style={{marginTop: 0}}>Join Quiz</h4>
                <Textfield onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    this.setState({...this.state, joinId: event.currentTarget.value.trim()})
                }}
                           label="Quiz ID"
                           error="ID is too long"
                           pattern="^[A-Za-z1-9]{0,6}$"/>
                <Textfield onChange={(event: React.FormEvent<HTMLInputElement>) => {
                    this.setState({...this.state, nickname: event.currentTarget.value.trim()})
                }}
                           label="Nickname"/>
                <br/>
                <Button raised ripple colored style={{margin: '10px'}}
                        disabled={this.isJoinDisabled()}
                        onClick={this.joinQuiz}>Join</Button>
            </div>
        );
    }

    private showErrorToast(message: string) {
        this.props.toastManager.add(message, {
            appearance: 'error',
            autoDismiss: true,
        })
    }

}

export default withToastManager(withApollo(JoinQuiz));