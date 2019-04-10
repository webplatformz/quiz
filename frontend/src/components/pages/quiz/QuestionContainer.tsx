import React, {Component} from 'react'
import {Question} from '../../../../../server/domain/question';
import {Button, CardText} from 'react-mdl';

interface QuestionContainerProps {
    question: Question;
}

export class QuestionContainer extends Component<QuestionContainerProps, any> {

    render() {
        return (
            <div>
                <div>{this.props.question.question}</div>
                <div>
                    {
                        this.props.question.answers.map((answer => {
                            return (
                                <div className="answer">
                                    {answer.answer}
                                </div>)
                        }))
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

    private launchNextQuestion() {
        console.log(`Launch next question`);
    }
}