import React from 'react';
import {Answer} from '../../../../../server/domain/answer';

interface AnswerComponentProps {
    answer: Answer;
    isChosen: boolean;
    onClick: any;
}

export const AnswerComponent = (props: AnswerComponentProps) => {
    return (<div style={
        {
            minWidth: '400px',
            backgroundColor: props.isChosen ? 'lightseagreen' : 'white',
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