import React, {Component} from 'react'
import {gql} from "apollo-boost";
import {withApollo, WithApolloClient} from "react-apollo";
import { Button, Textfield, Card, CardTitle, CardText } from 'react-mdl';

interface JoinQuizState {
    joinId: string,
    nickname: string
}

interface JoinQuizProps {
    joinQuiz: (joinId: string) => void
}

const JOIN_MUTATION = gql`
    mutation join($joinId: String!, $nickname: String!){
        join(input: { joinId: $joinId, nickname: $nickname}) {
          joinId
        }
    }
`;

class JoinQuiz extends Component<WithApolloClient<JoinQuizProps>, JoinQuizState> {
    state: JoinQuizState =  {
        joinId: "",
        nickname: ""
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
            .then((response: any) => this.props.joinQuiz(response.data.join.joinId));
    }

    render() {
        return (
            <div>
                <Card shadow={0} style={{width: '300px', height: '400px', margin: 'auto'}}>
                    <CardTitle style={{textAlign: "center"}}>Join Quiz</CardTitle>
                    <CardText>
                        <Textfield onChange={(event: React.FormEvent<HTMLInputElement>) =>
                        {this.setState({...this.state, joinId: event.currentTarget.value})}}
                                   label="Quiz ID"
                                   pattern="^[A-Za-z1-9]{0,6}$" />
                        <br/>
                        <Textfield onChange={(event: React.FormEvent<HTMLInputElement>) =>
                        {this.setState({...this.state, nickname: event.currentTarget.value})}}
                                   label="Nickname" />
                        <br/>
                        <br/>
                        <Button raised ripple onClick={this.joinQuiz}>Join</Button>
                    </CardText>
                </Card>
            </div>
        );
    }
}

export default withApollo(JoinQuiz);