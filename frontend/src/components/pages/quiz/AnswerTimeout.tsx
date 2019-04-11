import React, {Component} from 'react'
import {ProgressBar} from 'react-mdl';

interface AnswerTimeoutProps {
    remainingTime: number
}

export class AnswerTimeout extends Component<AnswerTimeoutProps, any> {

    render() {
        return (
            <div style={{width: '100%', display: 'block'}}>
                <ProgressBar progress={100 - this.props.remainingTime} style={{width: '100%'}} />
            </div>);
    }
}