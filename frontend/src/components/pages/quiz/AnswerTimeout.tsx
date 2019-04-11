import React, {Component} from 'react'

interface AnswerTimeoutState {
    remainingTime: number;
}

export class AnswerTimeout extends Component<any, AnswerTimeoutState> {
    state = {
        remainingTime: 10
    };

    render() {
        return (
            <div style={{
                fontSize: 'xx-large',
                fontWeight: 'bolder'
            }}>
                {this.state.remainingTime}
            </div>);
    }
}