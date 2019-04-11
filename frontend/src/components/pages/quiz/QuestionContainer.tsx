import React, {Component} from 'react'
import {Question} from '../../../../../server/domain/question';
import {Button, CardText} from 'react-mdl';
import {AnswerComponent} from './AnswerComponent';
import {AnswerTimeout} from './AnswerTimeout';

interface QuestionContainerProps {
    question: Question;
}

interface QuestionContainerState {
    chosenAnswerId: string | undefined;
}

export class QuestionContainer extends Component<QuestionContainerProps, QuestionContainerState> {

    state = {
        chosenAnswerId: undefined
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
                                                            isChosen={this.state.chosenAnswerId === answer.id}
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

    private answerQuestion(answerId: string) {
        if (!this.state.chosenAnswerId) {
            this.setState({...this.state, chosenAnswerId: answerId});
        }
    }

    private launchNextQuestion() {
        console.log(`Launch next question`);
    }
}