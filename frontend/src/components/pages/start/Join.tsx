import React, {Component} from 'react'
import {gql} from "apollo-boost";
import {withApollo} from "react-apollo";
import { Button, Textfield } from 'react-mdl';
import {withRouter} from "react-router";

const JOIN_MUTATION = gql`
    mutation join($joinId: String!){
        join(joinId: $joinId) {
          joinId
        }
    }
`;

class Join extends Component<any, any> {
    state = {
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
                <Textfield onChange={(e: any) => {this.setState({...this.state, joinId: e.target.value})}}
                           label="Quiz ID"
                           pattern="-?[0-9]*(\.[0-9]+)?"
                           style={{width: '200px'}} />
                <br/>
                <Textfield onChange={(e: any) => {this.setState({...this.state, nickname: e.target.value})}}
                           label="Nickname"
                           style={{width: '200px'}} />
                <br/>
                <br/>
                <Button raised onClick={this.joinQuiz}>Join</Button>
            </div>
        );
    }
}

export default withRouter(withApollo(Join));