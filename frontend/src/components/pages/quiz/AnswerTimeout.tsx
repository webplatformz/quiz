import React, {Component} from 'react'
import {ProgressBar} from 'react-mdl';

interface AnswerTimeoutState {
    remainingTime: number;
}

export class AnswerTimeout extends Component<any, AnswerTimeoutState> {
    state = {
        remainingTime: 100
    };

    /*componentDidMount(): void {
        setInterval(() => {
            this.state.remainingTime
        },100)
    }*/

    render() {
        return (
            <div>
                <ProgressBar progress={this.state.remainingTime} />
            </div>);
    }

}