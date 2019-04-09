import React, {Component} from 'react'
import { Button } from 'react-mdl';
import {gql} from "apollo-boost";
import {withApollo} from "react-apollo";


const CREATE_QUIZ_MUTATION = gql`
    mutation {
        createQuiz
    }
`;

const UPDATE_QUIZ_MUTATION = gql`
    mutation updateQuiz($quizId: String!){
        updateQuiz(input: { quizId: $quizId, name: "Dummy", questions: []}) {
          name
          operatorId
        }
    }
`;

const START_QUIZ = gql`
    mutation joinAsOperator($operatorId: String!){
        joinAsOperator(input: { operatorId: $operatorId}) {
          operatorId
          joinId
        }
    }
`;

class Create extends Component<any, any> {
    state = {
        quizState: "Quiz not created yet",
        quizId: "-",
        quizName: "-",
        joinId: "-",
        operatorId: "-",
    };

    constructor(props: any) {
        super(props);
        this.createDummyQuiz = this.createDummyQuiz.bind(this);
    }

    createDummyQuiz() {
        this.props.client.mutate({
                mutation: CREATE_QUIZ_MUTATION,
            })
            .then((response: any) => {
                this.setState({...this.state,
                    quizState: "Quiz created",
                    quizId: response.data
                });
                return this.updateDummyQuiz(response.data);
            });
    }

    updateDummyQuiz(quizId: string) {
        this.props.client.mutate({
                mutation: UPDATE_QUIZ_MUTATION,
                variables: {
                    quizId: quizId
                }
            })
            .then((response: any) => {
                this.setState({...this.state,
                    quizState: "Quiz updated",
                    quizName: response.data.name
                });
                return this.startQuiz(response.data.operatorId);
            });
    }

    startQuiz(operatorId: string) {
        this.props.client.mutate({
                mutation: START_QUIZ,
            })
            .then((response: any) => this.setState({...this.state,
                quizState: "Quiz started",
                joinId: response.data.joinId,
                operatorId: response.data.operatorId
            }));
    }

    render() {
        return (
            <div>
                <p>State: {this.state.quizState}</p>
                <p>Name: {this.state.quizName}</p>
                <p>JoinId: {this.state.joinId}</p>
                <p>OperatorId: {this.state.operatorId}</p>
                <Button raised ripple onClick={this.createDummyQuiz}>Create</Button>
            </div>
        )
    }
}

export default withApollo(Create);