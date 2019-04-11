import React, {Component} from 'react'
import {Question} from '../../../../../server/domain/question';
import {Button, CardText} from 'react-mdl';
import {AnswerComponent} from './AnswerComponent';

interface QuestionContainerProps {
    question: Question;
}

export class QuestionContainer extends Component<QuestionContainerProps, any> {

    render() {
        return (
            <div>
                <div><h1>{this.props.question.question}</h1></div>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {
                        this.props.question.answers
                            .map(answer => <AnswerComponent key={answer.id} answer={answer}
                                                            onClick={this.answerQuestion.bind(this, answer.id)}/>)
                    }
                </div>
                <div>
                    <Button raised ripple onClick={this.launchNextQuestion}>
                        Launch next question
                    </Button>
                </div>
            </div>
        )
    }

    private answerQuestion(answerId: string) {
        console.log(`Answer with ID ${answerId}`);
    }

    private launchNextQuestion() {
        console.log(`Launch next question`);
    }
}