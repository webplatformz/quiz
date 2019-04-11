import React from 'react';
import {Answer} from '../../../../../server/domain/answer';
import {Button} from 'react-mdl';

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
    return (
        <Button raised ripple style={{
                backgroundColor: getBackgroundColor(props.state),
                border: getBorder(props.state),
                boxSizing: 'border-box',
                fontSize: 'large',
                margin: '16px 0',
                padding: '12px 5px',
                height: 'auto',
                width: '100%',
                cursor: 'pointer',
            }}
             onClick={props.onClick}>
            {props.answer.answer}
        </Button>
    );
};

function getBorder(answerState: AnswerComponentState = AnswerComponentState.NONE): string {
    switch (answerState) {
        case AnswerComponentState.CHOSEN:
            return '2px solid #3ea026';
        default:
            return 'none'
    }
}

function getBackgroundColor(answerState: AnswerComponentState = AnswerComponentState.NONE): string {
    switch (answerState) {
        case AnswerComponentState.CHOSEN:
            return '';
        case AnswerComponentState.CORRECT:
            return '#07b631';
        case AnswerComponentState.WRONG:
            return '#FF0D00';
        case AnswerComponentState.NONE:
            return 'default';
        default:
            throw new Error(`Invalid state ${answerState}`)
    }
}