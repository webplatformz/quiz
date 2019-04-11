import React from 'react';
import {Answer} from '../../../../../server/domain/answer';

interface AnswerComponentProps {
    answer: Answer;
    onClick: any;
    state: AnswerComponentState,
}

export enum AnswerComponentState {
    CHOSEN,
    WRONG,
    CORRECT,
    NONE,
}

export const AnswerComponent = (props: AnswerComponentProps) => {
    return (<div style={
        {
            minWidth: '400px',
            backgroundColor: getBackgroundColor(props.state),
            padding: '40px',
            fontSize: 'large',
            margin: '20px',
            cursor: 'pointer',
            boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.75)'
        }}
                 onClick={props.onClick}>
        {props.answer.answer}
    </div>)
};

function getBackgroundColor(answerState: AnswerComponentState = AnswerComponentState.NONE): string {
    switch (answerState) {
        case AnswerComponentState.CHOSEN:
            return 'lightseagreen';
        case AnswerComponentState.CORRECT:
            return 'lightgreen';
        case AnswerComponentState.WRONG:
            return 'red';
        case AnswerComponentState.NONE:
            return 'white';
        default:
            throw new Error(`Invalid state ${answerState}`)
    }
}