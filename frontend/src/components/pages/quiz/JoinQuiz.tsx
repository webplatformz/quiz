import React, {Component} from 'react'
import {gql} from 'apollo-boost';
import {withApollo, WithApolloClient} from 'react-apollo';
import {Button, Textfield, Card, CardTitle, CardText} from 'react-mdl';
import {Player} from '../../../../../server/domain/player';

interface JoinQuizState {
    joinId: string,
    nickname: string
}

interface JoinQuizProps {
    joinQuiz: (joinId: string, players: Player[]) => void
}

const JOIN_MUTATION = gql`
    mutation join($joinId: String!, $nickname: String!){
        join(input: { joinId: $joinId, nickname: $nickname}) {
            joinId,
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

    joinQuiz(): void {
        this.props.client.mutate({
                mutation: JOIN_MUTATION,
                variables: {
                    joinId: this.state.joinId,
                    nickname: this.state.nickname
                }
            })
            .then((response: any) => this.props.joinQuiz(response.data.join.joinId, response.data.join.players));
    }

    render() {
        return (
            <div>
                <h4 style={{marginTop: 0}}>Join Quiz</h4>
                <Textfield onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                this.setState({...this.state, joinId: event.currentTarget.value})
                            }}
                           label="Quiz ID"
                           pattern="^[A-Za-z1-9]{0,6}$"/>
                <Textfield onChange={(event: React.FormEvent<HTMLInputElement>) => {
                                this.setState({...this.state, nickname: event.currentTarget.value})
                            }}
                           label="Nickname"/>
                <br/>
                <Button raised ripple colored style={{margin: '10px'}} onClick={this.joinQuiz}>Join</Button>
            </div>
        );
    }
}

export default withApollo(JoinQuiz);