import React, {Component} from 'react'
import {gql} from "apollo-boost";
import {withApollo} from "react-apollo";
import { Button, Textfield } from 'react-mdl';
import {withRouter} from "react-router";

const JOIN_MUTATION = gql`
    mutation join($joinId: String!, $nickname: String!){
        join(input: { joinId: $joinId, nickname: $nickname}) {
          joinId
        }
    }
`;

class Join extends Component<any, JoinState> {
    state: JoinState=  {
        joinId: "",
        nickname: ""
    };

    constructor(props: any) {
        super(props);
        this.joinQuiz = this.joinQuiz.bind(this);
    }

    joinQuiz() {
        this.props.client.mutate({
                mutation: JOIN_MUTATION,
                variables: {
                    joinId: this.state.joinId,
                    nickname: this.state.nickname
                }
            })
            .then((response: any) => this.forwardToQuiz(response.data.join.joinId));
    }

    forwardToQuiz(joinId: string) {
        this.props.history.push(`/${joinId}`);
    }

    render() {
        return (
            <div>
                <Textfield onChange={(event: React.FormEvent<HTMLInputElement>) =>
                                {this.setState({...this.state, joinId: event.currentTarget.value})}}
                           label="Quiz ID"
                           pattern="^[A-Za-z1-9]{0,6}$"
                           style={{width: '200px'}} />
                <br/>
                <Textfield onChange={(event: React.FormEvent<HTMLInputElement>) =>
                                {this.setState({...this.state, nickname: event.currentTarget.value})}}
                           label="Nickname"
                           style={{width: '200px'}} />
                <br/>
                <br/>
                <Button raised onClick={this.joinQuiz}>Join</Button>
            </div>
        );
    }
}

interface JoinState {
    joinId: string,
    nickname: string
}

export default withRouter(withApollo(Join));