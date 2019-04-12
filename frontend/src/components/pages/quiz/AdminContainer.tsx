import React, {Component} from 'react'
import {Button, Card} from 'react-mdl';
import {gql} from "apollo-boost";
import {withApollo} from "react-apollo";
import {withRouter} from "react-router";

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

class AdminContainer extends Component<any, any> {
    state = {
        quizState: 'Quiz not created yet',
        quizId: '-',
        quizName: '-',
        joinId: '-',
        operatorId: '-',
    };

    constructor(props: any) {
        super(props);
        this.updateDummyQuiz = this.updateDummyQuiz.bind(this);
        this.joinAsOperator = this.joinAsOperator.bind(this);
        const quizId = this.props.match.params.quizId;
        if (quizId) {
            this.updateDummyQuiz(quizId);
        }
    }

    joinAsOperator() {
        this.props.history.push(`/operator/${this.state.operatorId}`);
    }

    private updateDummyQuiz(quizId: string) {
        this.props.client.mutate({
            mutation: UPDATE_QUIZ_MUTATION,
            variables: {
                quizId: quizId
            }
        })
            .then((response: any) => {
                this.setState({
                    ...this.state,
                    quizState: "Quiz updated",
                    quizId: quizId,
                    operatorId: response.data.updateQuiz.operatorId,
                    quizName: response.data.updateQuiz.name
                });
                return this.startQuiz(response.data.updateQuiz.operatorId);
            });
    }


    private startQuiz(operatorId: string) {
        this.props.client.mutate({
            mutation: START_QUIZ,
            variables: {
                operatorId: operatorId
            }
        })
            .then((response: any) => this.setState({
                ...this.state,
                quizState: "Quiz started",
                joinId: response.data.joinAsOperator.joinId,
            }));
    }

    render() {
        return (
            <div style={{display: 'flex', maxWidth: '600px', margin: 'auto', padding: '16px'}}>
                <Card shadow={3} style={{flex: '1', padding: '16px'}}>
                    <h4 style={{marginTop: 0}}>Create Quiz</h4>
                    <p>
                        State: {this.state.quizState} <br/>
                        QuizId: {this.state.quizId} <br/>
                        Name: {this.state.quizName} <br/>
                        OperatorId: {this.state.operatorId}<br/>
                        JoinId: {this.state.joinId} <br/>
                    </p>
                    <Button raised ripple colored style={{marginTop: '8px', marginBottom: '10px'}}
                            onClick={this.joinAsOperator}>Join as operator</Button>
                </Card>
            </div>
        )
    }
}

export default withRouter(withApollo(AdminContainer));