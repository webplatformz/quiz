import React from 'react';
import {Answer} from '../../../../../server/domain/answer';
import {Button} from 'react-mdl';

interface AnswerComponentProps {
    answer: Answer;
    onClick: any;
    isCorrectAnswer: boolean,
    isSelected: boolean
}


export const AnswerComponent = (props: AnswerComponentProps) => {
    return (
        <Button raised ripple style={{
            backgroundColor: getBackgroundColor(props.isCorrectAnswer),
            border: getBorder(props.isSelected),
            boxSizing: 'border-box',
            fontSize: 'large',
            margin: '16px 0',
            padding: '12px 5px',
            height: 'auto',
            width: '100%',
            cursor: 'pointer'
        }}
                onClick={props.onClick}>
            {props.answer.answer}
        </Button>
    );
};

function getBorder(isSelected: boolean): string {
    if (isSelected) {
        return '5px solid #3ea026';
    } else {
        return 'none';
    }
}

function getBackgroundColor(isCorrectAnswer: boolean): string {
    if (isCorrectAnswer) {
        return 'rgba(7,182,49,0.6)';
    } else {
        return 'default';
    }
}