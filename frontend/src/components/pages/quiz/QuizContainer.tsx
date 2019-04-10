import React, {Component} from 'react'
import JoinQuiz from "./JoinQuiz";
import CreateQuiz from "./CreateQuiz";
import {Player} from "../../../../../server/domain/player";
import {withApollo, WithApolloClient} from "react-apollo";
import {gql} from "apollo-boost";
import PlayerList from "./PlayerList";
import {Grid, Cell} from 'react-mdl';
import {Question} from "../../../../../server/domain/question";
import {Answer} from "../../../../../server/domain/answer";
import {Ranking} from "../../../../../server/domain/ranking";

interface QuizContainerState {
    joinId: string,
    players: Player[],
    question?: Question,
    answer?: Answer,
    ranking?: Ranking
}

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
            question
        }
    }
`;

const QUESTION_TIMEOUT_SUBSCRIPTION = gql`
    subscription onQuestionTimeout($joinId: String!){
        onQuestionTimeout(joinId: $joinId) {
            answer
        }
    }
`;

const RANKING_CHANGED_SUBSCRIPTION = gql`
    subscription onRankingChanged($joinId: String!){
        onRankingChanged(joinId: $joinId) {
            ranking
        }
    }
`;

class QuizContainer extends Component<WithApolloClient<any>, QuizContainerState> {
    state: QuizContainerState = {
        joinId: "",
        players: [],
        question: undefined,
        ranking: undefined
    };

    constructor(props: any) {
        super(props);
        this.joinQuiz = this.joinQuiz.bind(this);
    }

    joinQuiz(joinId: string) {
        this.setState({...this.state, joinId: joinId});
        this.subscribeToPlayerJoined();
    }

    subscribeToPlayerJoined(): void {
        this.props.client.subscribe({
            query: PLAYER_JOIN_SUBSCRIPTION,
            variables: {
                joinId: this.state.joinId
            }
        }).subscribe((response: any) => {
            this.setState({...this.state, players: response.data.onPlayerJoined.players});
        })
    }

    // TODO: subscribe to me
    subscribeToNextQuestion(): void {
        this.props.client.subscribe({
            query: NEXT_QUESTION_SUBSCRIPTION,
            variables: {
                joinId: this.state.joinId
            }
        }).subscribe((response: any) => {
            this.setState({...this.state, question: response.data.onNextQuestion.question});
        })
    }

    // TODO: subscribe to me
    subscribeToQuestionTimeout(): void {
        this.props.client.subscribe({
            query: QUESTION_TIMEOUT_SUBSCRIPTION,
            variables: {
                joinId: this.state.joinId
            }
        }).subscribe((response: any) => {
            this.setState({...this.state, answer: response.data.onQuestionTimeout.answer});
        })
    }

    // TODO: subscribe to me
    subscribeToRankingChanged(): void {
        this.props.client.subscribe({
            query: RANKING_CHANGED_SUBSCRIPTION,
            variables: {
                joinId: this.state.joinId
            }
        }).subscribe((response: any) => {
            this.setState({...this.state, ranking: response.data.onRankingChanged.ranking});
        })
    }

    render() {
        if (this.state.joinId) {
            return (
                <div style={{width: '80%', margin: 'auto', paddingTop: '16px'}}>
                    <PlayerList players={this.state.players}/>
                </div>
            );
        }

        return (
            <div style={{width: '80%', margin: 'auto'}}>
                <Grid>
                    <Cell col={6}>
                        <JoinQuiz joinQuiz={this.joinQuiz}/>
                    </Cell>
                    <Cell col={6}>
                        <CreateQuiz/>
                    </Cell>
                </Grid>
            </div>
        )
    }
}

export default withApollo(QuizContainer);