import React, {Component} from 'react'
import {Button} from 'react-mdl';
import {gql} from "apollo-boost";
import {withApollo} from "react-apollo";
import {withRouter} from "react-router";

const CREATE_QUIZ_MUTATION = gql`
    mutation {
        createQuiz
    }
`;

class CreateQuiz extends Component<any, any> {

    constructor(props: any) {
        super(props);
        this.createQuiz = this.createQuiz.bind(this);
    }

    createQuiz() {
        this.props.client.mutate({
            mutation: CREATE_QUIZ_MUTATION,
        }).then((response: any) => {
            this.props.history.push(`/admin/${response.data.createQuiz}`);
        });
    }

    render() {
        return (
            <div>
                <h4 style={{marginTop: 0}}>Create Quiz</h4>
                <Button raised ripple colored style={{marginTop: '8px', marginBottom: '10px'}}
                        onClick={this.createQuiz}>Create</Button>
            </div>
        )
    }
}

export default withRouter(withApollo(CreateQuiz));