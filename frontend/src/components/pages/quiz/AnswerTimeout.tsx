import React, {Component} from 'react'
import {ProgressBar} from 'react-mdl';

interface AnswerTimeoutProps {
    questionId: string | undefined;
}

interface AnswerTimeoutState {
    startingTime: Date | undefined;
    elapsedTime: number;
}

export class AnswerTimeout extends Component<AnswerTimeoutProps, AnswerTimeoutState> {

    private readonly QUESTION_TIMEOUT = 10000;

    state = {
        startingTime: undefined,
        elapsedTime: 0
    };

    componentDidUpdate(prevProps: AnswerTimeoutProps) {
        if (this.props.questionId !== prevProps.questionId) {
            this.setState({...this.state, startingTime: new Date()});
        }
    }

    componentDidMount(): void {
        const interval = setInterval(() => {
            let elapsedTime = 0;
            const startingTime = this.state.startingTime;
            if (startingTime) {
                elapsedTime = new Date().getTime() - (startingTime as Date).getTime();
            }
            this.setState({...this.state, elapsedTime: elapsedTime});
            if (elapsedTime >= this.QUESTION_TIMEOUT) {
                clearInterval(interval);
            }
        }, 100);
    }

    render() {
        return (
            <div>
                <ProgressBar progress={100 * this.state.elapsedTime / this.QUESTION_TIMEOUT}/>
            </div>);
    }

}