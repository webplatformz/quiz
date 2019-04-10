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
                <div><h1>{this.props.question.question}</h1></div>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {
                        this.props.question.answers.map((answer => {
                            return (
                                <div key={answer.id} style={
                                    {
                                        minWidth: '400px',
                                        backgroundColor: 'white',
                                        padding: '40px',
                                        fontSize: 'large',
                                        margin: '20px',
                                        cursor: 'pointer',
                                        boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.75)'
                                    }}>
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