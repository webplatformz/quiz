import React, {Component} from 'react'
import {Question} from '../../../../../server/domain/question';
import {Button} from 'react-mdl';
import {AnswerComponent, AnswerComponentState} from './AnswerComponent';
import {AnswerTimeout} from './AnswerTimeout';

interface QuestionContainerProps {
    question: Question;
    correctAnswerId: string | undefined;
}

interface QuestionContainerState {
    chosenAnswerId: string | undefined;
}

export class QuestionContainer extends Component<QuestionContainerProps, QuestionContainerState> {

    state = {
        chosenAnswerId: undefined,
    };

    render() {
        return (
            <div>
                <div><h1>{this.props.question.question}</h1></div>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {
                        this.props.question.answers
                            .map(answer => <AnswerComponent key={answer.id}
                                                            answer={answer}
                                                            state={this.getAnswerState(answer.id)}
                                                            onClick={this.answerQuestion.bind(this, answer.id)}/>)
                    }
                </div>
                <div style={{
                    display: 'flex',
                    marginTop: '20px',
                    justifyContent: 'space-around'
                }}>
                    <AnswerTimeout/>
                    <Button raised ripple onClick={this.launchNextQuestion}>
                        Launch next question
                    </Button>
                </div>
            </div>
        )
    }

    private getAnswerState(answerId: string): AnswerComponentState {
        // Question timeout has been reached
        if (this.props.correctAnswerId) {
            if (this.state.chosenAnswerId && this.state.chosenAnswerId === answerId) {
                return this.props.correctAnswerId === this.state.chosenAnswerId ? AnswerComponentState.CORRECT : AnswerComponentState.WRONG;
            } else if(this.props.correctAnswerId === answerId){
                return AnswerComponentState.WRONG;
            }
        } else {
            if (this.state.chosenAnswerId && answerId === this.state.chosenAnswerId) {
                return AnswerComponentState.CHOSEN;
            } else {
                return AnswerComponentState.NONE;
            }
        }
        return AnswerComponentState.NONE;

    }

    private answerQuestion(answerId: string) {
        if (!this.state.chosenAnswerId) {
            this.setState({...this.state, chosenAnswerId: answerId});
        }
    }

    private launchNextQuestion() {
        console.log(`Launch next question`);
    }
}