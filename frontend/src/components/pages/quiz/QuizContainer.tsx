import React, {Component} from 'react'
import {Player} from '../../../../../server/domain/player';
import {withApollo, WithApolloClient} from 'react-apollo';
import {gql} from 'apollo-boost';
import {WaitingRoom} from './WaitingRoom';
import {StartPage} from './StartPage';
import {QuestionContainer} from './QuestionContainer';
import {Question} from '../../../../../server/domain/question';

interface QuizContainerState {
    joinId: string | undefined,
    operatorId: string | undefined,
    players: Player[],
    activeComponent: ActiveComponent,
    currentQuestion: Question | undefined,
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

enum ActiveComponent {
    START_PAGE,
    WAITING_ROOM,
    QUESTION,
}


const dummyQuestion: Question = {
    id: 'Q1',
    question: 'Das ist eine durchschnittliche Frage',
    answers: [{
        id: 'A1',
        answer: 'Das ist die Antwort 1',
        isCorrect: false
    }, {
        id: 'A2',
        answer: 'Das ist die Antwort 2',
        isCorrect: false
    }, {
        id: 'A3',
        answer: 'Das ist die Antwort 3',
        isCorrect: false
    }, {
        id: 'A4',
        answer: 'Das ist die Antwort 4',
        isCorrect: false
    }
    ]
};

class QuizContainer extends Component<WithApolloClient<any>, QuizContainerState> {
    state: QuizContainerState = {
        joinId: undefined,
        operatorId: undefined,
        players: [],
        activeComponent: ActiveComponent.QUESTION,
        currentQuestion: dummyQuestion
    };

    constructor(props: any) {
        super(props);
        this.joinQuiz = this.joinQuiz.bind(this);
        this.state.operatorId = this.props.match.params.operatorId;
    }

    joinQuiz(joinId: string, players: Player[]) {
        this.setState({...this.state, joinId, players, activeComponent: ActiveComponent.WAITING_ROOM});
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

    render() {
        return (
            <div style={{width: '80%', margin: 'auto', paddingTop: '16px'}}>
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
                    <WaitingRoom players={this.state.players} operatorId={this.state.operatorId}/>
                );
            case ActiveComponent.QUESTION:
                if (!this.state.currentQuestion) {
                    throw new Error('Invalid state. Question is not defined');
                }
                return (<QuestionContainer question={this.state.currentQuestion}/>)

        }
    }
}

export default withApollo(QuizContainer);