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
    mutation updateQuiz($quizId: ID!){
        updateQuiz(input: {id: $quizId, name: "Dummy", questions: []}) {
          name
          operatorId
        }
    }
`;

const START_QUIZ = gql`
    mutation joinAsOperator($operatorId: String!){
        joinAsOperator(operatorId: $operatorId) {
          operatorId
          joinId
        }
    }
`;

class Create extends Component<any, any> {
    state = {
        quizState: 'Quiz not created yet',
        quizId: '-',
        quizName: '-',
        joinId: '-',
        operatorId: '-',
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
                    quizId: response.data.createQuiz
                });
                return this.updateDummyQuiz(response.data.createQuiz);
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
                    operatorId: response.data.updateQuiz.operatorId,
                    quizName: response.data.updateQuiz.name
                });
                return this.startQuiz(response.data.updateQuiz.operatorId);
            });
    }

    startQuiz(operatorId: string) {
        this.props.client.mutate({
                mutation: START_QUIZ,
                variables: {
                    operatorId: operatorId
                }
            })
            .then((response: any) => this.setState({...this.state,
                quizState: "Quiz started",
                joinId: response.data.joinAsOperator.joinId,
            }));
    }

    render() {
        return (
            <div>
                <p>State: {this.state.quizState}</p>
                <p>QuizId: {this.state.quizId}</p>
                <p>Name: {this.state.quizName}</p>
                <p>OperatorId: {this.state.operatorId}</p>
                <p>JoinId: {this.state.joinId}</p>
                <Button raised ripple onClick={this.createDummyQuiz}>Create</Button>
            </div>
        )
    }
}

export default withApollo(Create);