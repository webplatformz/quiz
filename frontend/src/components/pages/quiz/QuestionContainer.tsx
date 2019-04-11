import React, {Component} from 'react'
import {Question} from '../../../../../server/domain/question';
import {Button, Card} from 'react-mdl';
import {AnswerComponent} from './AnswerComponent';
import {AnswerTimeout} from './AnswerTimeout';
import {gql} from 'apollo-boost';
import {withApollo, WithApolloClient} from 'react-apollo';

interface QuestionContainerProps {
    joinId: string | undefined;
    playerId: string | undefined;
    operatorId: string | undefined;
    question: Question;
    correctAnswerId: string | undefined;
}

interface QuestionContainerState {
    questionId: string | undefined;
    chosenAnswerId: string | undefined;
}

const ANSWER_QUESTION_MUTATION = gql`
    mutation answerQuestion($joinId: String!, $playerId: ID!, $answerId: ID!){
        answerQuestion(joinId: $joinId, playerId: $playerId, answerId: $answerId)
    }
`;

const LAUNCH_QUESTION_MUTATION = gql`
    mutation launchNextQuestion($operatorId: String!){
        launchNextQuestion(operatorId: $operatorId)
    }
`;

class QuestionContainer extends Component<WithApolloClient<QuestionContainerProps>, QuestionContainerState> {
    state = {
        questionId: undefined,
        chosenAnswerId: undefined
    };

    constructor(props: WithApolloClient<QuestionContainerProps>) {
        super(props);
        this.launchNextQuestion = this.launchNextQuestion.bind(this);
    }

    render() {
        let answers;
        let launchButton;
        if (!this.props.operatorId) {
            answers = (
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                    {
                        this.props.question.answers
                            .map(answer => <AnswerComponent key={answer.id}
                                                            answer={answer}
                                                            isCorrectAnswer={answer.id === this.props.correctAnswerId}
                                                            isSelected={answer.id === this.state.chosenAnswerId}
                                                            onClick={this.answerQuestion.bind(this, answer.id)}/>)
                    }
                </div>
            );
        } else {
            if (this.props.correctAnswerId) {
                launchButton = (
                    <Button raised ripple colored style={{marginTop: '24px'}} onClick={this.launchNextQuestion}>
                        Launch next question
                    </Button>
                );
            }
        }

        return (
            <Card shadow={3} style={{flex: '1', padding: '16px'}}>
                <div style={{padding: '10px', borderRadius: '5px', border: '1px solid #aeaeae'}}>
                    <h4 style={{margin: 0, textAlign: 'center'}}>{this.props.question.question}</h4>
                </div>
                {answers}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    marginTop: '20px',
                    justifyContent: 'space-around'
                }}>
                    <AnswerTimeout questionId={this.props.question.id}/>
                    {launchButton}
                </div>
            </Card>
        )
    }

    private answerQuestion(answerId: string) {
        if (!this.state.chosenAnswerId) {
            this.setState({...this.state, chosenAnswerId: answerId});
            this.props.client.mutate({
                mutation: ANSWER_QUESTION_MUTATION,
                variables: {
                    joinId: this.props.joinId,
                    playerId: this.props.playerId,
                    answerId: answerId
                }
            })
        }
    }

    private launchNextQuestion() {
        this.props.client.mutate({
            mutation: LAUNCH_QUESTION_MUTATION,
            variables: {
                operatorId: this.props.operatorId
            }
        });
    }
}

export default withApollo(QuestionContainer);