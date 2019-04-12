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

    private readonly QUESTION_TIMEOUT = 10000 - 500; // delay compensation

    state = {
        startingTime: undefined,
        elapsedTime: 0
    };

    componentDidMount(): void {
        this.updateElapsedTime();
    }

    componentDidUpdate(prevProps: AnswerTimeoutProps) {
        if (this.props.questionId !== prevProps.questionId || !this.state.startingTime) {
            this.updateElapsedTime();
        }
    }

    render() {
        return (
            <div style={{width: '100%',margin: '16px 0'}} >
                <ProgressBar style={{width: '100%'}} progress={100 * this.state.elapsedTime / this.QUESTION_TIMEOUT}/>
            </div>);
    }

    private updateElapsedTime() {
        this.setState({...this.state, startingTime: new Date(), elapsedTime: 0});
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

}