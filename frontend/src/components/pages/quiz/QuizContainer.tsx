import React, {Component} from 'react'
import {Player} from '../../../../../server/domain/player';
import {withApollo, WithApolloClient} from 'react-apollo';
import {gql} from 'apollo-boost';
import WaitingRoom from './WaitingRoom';
import {StartPage} from './StartPage';
import QuestionContainer from './QuestionContainer';
import {Question} from '../../../../../server/domain/question';
import {Answer} from '../../../../../server/domain/answer';
import {Ranking} from '../../../../../server/domain/ranking';
import {RankingContainer} from './Ranking';

interface QuizContainerState {
    joinId: string | undefined,
    operatorId: string | undefined,
    playerId: string | undefined,
    activeComponent: ActiveComponent,
    currentQuestion: Question | undefined,
    players: Player[],
    correctAnswer: Answer | undefined,
    ranking: Ranking | undefined,
    isFinalState: boolean
}

const JOIN_AS_OPERATOR_MUTATION = gql`
    mutation joinAsOperator($operatorId: String!){
        joinAsOperator(operatorId: $operatorId) {
            joinId
            operatorId
            players {
                id
                name
            }
        }
    }
`;

const PLAYER_JOIN_SUBSCRIPTION = gql`
    subscription onPlayerJoined($joinId: String!){
        onPlayerJoined(joinId: $joinId) {
            players {
                id
                name
            }
        }
    }
`;

const NEXT_QUESTION_SUBSCRIPTION = gql`
    subscription onNextQuestion($joinId: String!){
        onNextQuestion(joinId: $joinId) {
            id
            question
            answers {
                id
                answer
            }
        }
    }
`;

const QUESTION_TIMEOUT_SUBSCRIPTION = gql`
    subscription onQuestionTimeout($joinId: String!){
        onQuestionTimeout(joinId: $joinId) {
            id
            answer
        }
    }
`;

const RANKING_CHANGED_SUBSCRIPTION = gql`
    subscription onRankingChanged($joinId: String!){
        onRankingChanged(joinId: $joinId) {
            players {
                id
                name
            }
            isFinalState
        }
    }
`;

enum ActiveComponent {
    START_PAGE,
    WAITING_ROOM,
    QUESTION,
    RANKING_LIST
}

class QuizContainer extends Component<WithApolloClient<any>, QuizContainerState> {
    state: QuizContainerState = {
        joinId: undefined,
        operatorId: undefined,
        playerId: undefined,
        players: [],
        activeComponent: ActiveComponent.START_PAGE,
        currentQuestion: undefined,
        correctAnswer: undefined,
        ranking: undefined,
        isFinalState: false
    };

    constructor(props: any) {
        super(props);
        this.joinQuiz = this.joinQuiz.bind(this);
        const operatorId = this.props.match.params.operatorId;
        if (operatorId) {
            this.joinQuizAsOperator(operatorId);
        }
    }

    joinQuiz(joinId: string, playerId: string, players: Player[]) {
        this.setState({...this.state,
            joinId,
            playerId,
            players,
            activeComponent: ActiveComponent.WAITING_ROOM});
        this.subscribeToQuizEvents();
    }

    joinQuizAsOperator(operatorId: string): void {
        this.props.client.mutate({
                mutation: JOIN_AS_OPERATOR_MUTATION,
                variables: {
                    operatorId: operatorId
                }
            })
            .then((response: any) => {
                this.setState({...this.state,
                    joinId: response.data.joinAsOperator.joinId,
                    operatorId: response.data.joinAsOperator.operatorId,
                    players: response.data.joinAsOperator.players,
                    activeComponent: ActiveComponent.WAITING_ROOM
                });
                this.subscribeToQuizEvents();
            });
    }

    subscribeToQuizEvents(): void {
        this.subscribeToPlayerJoined();
        this.subscribeToNextQuestion();
        this.subscribeToQuestionTimeout();
        this.subscribeToRankingChanged();
    }

    subscribeToPlayerJoined(): void {
        this.props.client.subscribe({
            query: PLAYER_JOIN_SUBSCRIPTION,
            variables: {
                joinId: this.state.joinId
            }
        }).subscribe((response: any) => {
            this.setState({
                ...this.state,
                players: response.data.onPlayerJoined.players
            });
        })
    }

    subscribeToNextQuestion(): void {
        this.props.client.subscribe({
            query: NEXT_QUESTION_SUBSCRIPTION,
            variables: {
                joinId: this.state.joinId
            }
        }).subscribe((response: any) => {
            console.log('next question received');
            this.setState({
                ...this.state,
                currentQuestion: response.data.onNextQuestion,
                activeComponent: ActiveComponent.QUESTION,
                correctAnswer: undefined
            });
        })
    }

    subscribeToQuestionTimeout(): void {
        this.props.client.subscribe({
            query: QUESTION_TIMEOUT_SUBSCRIPTION,
            variables: {
                joinId: this.state.joinId
            }
        }).subscribe((response: any) => {
            this.setState({...this.state, correctAnswer: response.data.onQuestionTimeout});
        })
    }

    subscribeToRankingChanged(): void {
        this.props.client.subscribe({
            query: RANKING_CHANGED_SUBSCRIPTION,
            variables: {
                joinId: this.state.joinId
            }
        }).subscribe((response: any) => {
            this.setState({
                ...this.state,
                players: response.data.onRankingChanged.players,
                isFinalState: response.data.onRankingChanged.isFinalState
            });
        })
    }

    render() {
        return (
            <div style={{display: 'flex', maxWidth: '600px', margin: 'auto', padding: '16px'}}>
                {this.renderComponent()}
            </div>
        );
    }

    private renderComponent() {
        switch (this.state.activeComponent) {
            case ActiveComponent.START_PAGE:
                return (
                    <StartPage joinQuiz={this.joinQuiz}/>
                );
            case ActiveComponent.WAITING_ROOM:
                return (
                    <WaitingRoom players={this.state.players}
                                 operatorId={this.state.operatorId}
                                 joinId={this.state.joinId}/>
                );
            case ActiveComponent.QUESTION:
                if (!this.state.currentQuestion) {
                    throw new Error('Invalid state. Question is not defined');
                }
                const correctAnswerId = this.state.correctAnswer ? this.state.correctAnswer.id : undefined;
                return (
                    <QuestionContainer
                        joinId={this.state.joinId}
                        playerId={this.state.playerId}
                        operatorId={this.state.operatorId}
                        question={this.state.currentQuestion}
                        correctAnswerId={correctAnswerId}/>
                );
            case ActiveComponent.RANKING_LIST:
                return (<RankingContainer players={this.state.players} isFinalState={this.state.isFinalState}/>)
        }
    }
}

export default withApollo(QuizContainer);