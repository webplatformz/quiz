import React, {Component} from 'react'
import {Question} from '../../../../../server/domain/question';
import {Button, Card} from 'react-mdl';
import {AnswerComponent} from './AnswerComponent';
import {AnswerTimeout} from './AnswerTimeout';
import {gql} from 'apollo-boost';
import {withApollo, WithApolloClient} from 'react-apollo';
import {Ranking} from '../../../../../server/domain/ranking';
import {RankingContainer} from '../quiz/Ranking';
import {withToastManager} from 'react-toast-notifications';

interface QuestionContainerProps {
    joinId: string | undefined;
    playerId: string | undefined;
    operatorId: string | undefined;
    question: Question;
    ranking: Ranking | undefined;
    correctAnswerIds: string[];
    toastManager: any
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

    componentDidUpdate(prevProps: QuestionContainerProps): void {
        if (prevProps.correctAnswerIds.length !== 0 && this.props.correctAnswerIds.length === 0) {
            this.state.chosenAnswerId = undefined;
            this.setState({...this.state, chosenAnswerId: undefined})
        }
    }

    render() {
        let answers = this.renderAnswers();
        let launchButton = this.renderLaunchButton();
        let ranking = this.renderRanking();

        return (
            <Card shadow={3} style={{flex: '1', padding: '16px'}}>
                <div style={{padding: '10px', borderRadius: '5px', border: '1px solid #aeaeae'}}>
                    <h4 style={{margin: 0, textAlign: 'center'}}>{this.props.question.question}</h4>
                </div>
                {answers}
                <AnswerTimeout questionId={this.props.question.id}/>
                {ranking}
                {launchButton}
            </Card>
        )
    }

    private renderAnswers() {
        if (!this.props.operatorId) {
            return (
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'}}>
                    {
                        this.props.question.answers
                            .map(answer => <AnswerComponent key={answer.id}
                                                            answer={answer}
                                                            correctAnswerIds={this.props.correctAnswerIds}
                                                            isSelected={answer.id === this.state.chosenAnswerId}
                                                            isDisabled={this.state.chosenAnswerId !== undefined}
                                                            onClick={this.answerQuestion.bind(this, answer.id)}/>)
                    }
                </div>
            );
        }
    }

    private renderLaunchButton() {
        if (this.props.operatorId
            && this.props.correctAnswerIds.length !== 0
            && this.props.ranking
            && !this.props.ranking.isFinalState) {
            return (
                <Button raised ripple colored style={{marginTop: '24px'}} onClick={this.launchNextQuestion}>
                    Launch next question
                </Button>
            );
        }
    }

    private renderRanking() {
        if (this.props.operatorId && this.props.ranking) {
            return (
                <RankingContainer ranking={this.props.ranking}/>
            );
        }
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
                .catch(() => this.showErrorToast('Sending your answer failed, please try again.'));
        }
    }

    private launchNextQuestion() {
        this.props.client.mutate({
            mutation: LAUNCH_QUESTION_MUTATION,
            variables: {
                operatorId: this.props.operatorId
            }
        })
            .catch(() => this.showErrorToast('Launching next question failed, please try again.'));
    }

    private showErrorToast(message: string) {
        this.props.toastManager.add(message, {
            appearance: 'error',
            autoDismiss: true
        })
    }

}

export default withToastManager(withApollo(QuestionContainer));